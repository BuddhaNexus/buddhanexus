import os 
from setuptools import setup, find_packages

setup(
    name="buddhanexus",
    version="0.1.0",
    packages=find_packages(),
    install_requires=[
        "pandas",
        "natsort",
        "tqdm",
        # Add other dependencies from your project here
    ],
    author="Your Name",
    author_email="your.email@example.com",
    description="BuddhaNexus data processing and analysis tools",
    long_description=open("README.md").read() if os.path.exists("README.md") else "",
    long_description_content_type="text/markdown",
    url="https://github.com/yourusername/buddhanexus",  # If applicable
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: MIT License",  # Adjust license as needed
        "Operating System :: OS Independent",
    ],
    python_requires=">=3.6",
)