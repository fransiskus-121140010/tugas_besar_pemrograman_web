from django.shortcuts import render, get_object_or_404, redirect
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator
from django.db.models import Q
import json
from .models import Product
from .forms import ProductForm

# Placeholder for product CRUD views
def product_list(request):
    """Display list of products with search and pagination"""
    search_query = request.GET.get('search', '')
    category = request.GET.get('category', '')
    
    products = Product.objects.filter(is_active=True)
    
    if search_query:
        products = products.filter(
            Q(name__icontains=search_query) | 
            Q(description__icontains=search_query)
        )
    
    if category:
        products = products.filter(category=category)
    
    paginator = Paginator(products, 12)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    return render(request, 'products/list.html', {
        'products': page_obj,
        'search_query': search_query,
        'category': category
    })

def product_detail(request, product_id):
    """Display product details"""
    product = get_object_or_404(Product, id=product_id, is_active=True)
    return render(request, 'products/detail.html', {'product': product})

@login_required
def product_create(request):
    """Create new product"""
    if request.method == 'POST':
        form = ProductForm(request.POST, request.FILES)
        if form.is_valid():
            product = form.save(commit=False)
            product.created_by = request.user
            product.save()
            return redirect('product_detail', product_id=product.id)
    else:
        form = ProductForm()
    
    return render(request, 'products/create.html', {'form': form})

@login_required
def product_update(request, product_id):
    """Update existing product"""
    product = get_object_or_404(Product, id=product_id)
    
    if request.method == 'POST':
        form = ProductForm(request.POST, request.FILES, instance=product)
        if form.is_valid():
            form.save()
            return redirect('product_detail', product_id=product.id)
    else:
        form = ProductForm(instance=product)
    
    return render(request, 'products/update.html', {
        'form': form,
        'product': product
    })

@login_required
def product_delete(request, product_id):
    """Delete product (soft delete)"""
    product = get_object_or_404(Product, id=product_id)
    
    if request.method == 'POST':
        product.is_active = False
        product.save()
        return redirect('product_list')
    
    return render(request, 'products/delete.html', {'product': product})

@csrf_exempt
def product_api(request):
    """API endpoint for products"""
    if request.method == 'GET':
        products = Product.objects.filter(is_active=True).values(
            'id', 'name', 'price', 'description', 'category', 'stock'
        )
        return JsonResponse(list(products), safe=False)
    
    elif request.method == 'POST':
        try:
            data = json.loads(request.body)
            product = Product.objects.create(**data)
            return JsonResponse({
                'id': product.id,
                'message': 'Product created successfully'
            })
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)