import os 
from setuptools import setup, find_packages

setup(
    name="buddhanexus",
    version="0.1.0",
    packages=find_packages(),
    install_requires=[
        "fastapi>=0.109.1",
        "pytest>=8.0.0",
        "pytest-asyncio>=0.23.5",
        "httpx>=0.26.0",
        "pandas",
        "natsort",
        "tqdm",
        "pyarango>=1.3.3",
        "uvicorn>=0.11.7"
    ],
    python_requires=">=3.7",
)