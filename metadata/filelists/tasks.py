import os
from invoke import task

from metadata.filelists.meta_check_tsv_dir import meta_filter_tsv_dir

METADATA_DIR = "../"

@task
def filter_tsv(c, lang, target):
    meta_filter_tsv_dir(METADATA_DIR, lang, target)