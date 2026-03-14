from django.shortcuts import render


def index(request):
    """Render the landing page HTML template."""
    return render(request, 'index.html')
