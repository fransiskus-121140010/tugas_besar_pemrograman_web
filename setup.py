from setuptools import setup, find_packages

requires = [
    'pyramid',
    'psycopg2-binary',
    'sqlalchemy',
    'alembic',
    'pyramid_tm',
    'pyramid_retry',
    'waitress',
    'cornice',
    'passlib[bcrypt]',
    'pyramid_jwt',
]

setup(
    name='minervaproaudio_backend',
    version='0.0',
    packages=find_packages(),
    include_package_data=True,
    zip_safe=False,
    install_requires=requires,
    entry_points={
        'paste.app_factory': [
            'main = minervaproaudio_backend:main'
        ],
        'console_scripts': [
            'initialize_minervaproaudio_backend_db = minervaproaudio_backend.scripts.initializedb:main',
        ],
    },
)
