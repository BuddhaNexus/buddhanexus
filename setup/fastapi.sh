#!/usr/bin/env bash

mkdir opt/buddhanexus
cd opt/buddhanexus
ls -la
uvicorn main:app --reload
