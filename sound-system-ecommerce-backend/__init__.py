from pyramid.config import Configurator
from pyramid.response import Response

# Main application factory (main function for Pyramid)
def hello_world(request):
    return Response('Hello World!')


def main(global_config, **settings):
    """This function returns a Pyramid WSGI application."""
    with Configurator(settings=settings) as config:
        config.add_route('hello', '/')
        config.add_view(hello_world, route_name='hello')
        config.scan()
    return config.make_wsgi_app()