{
    "targets": [{
        "target_name": "zinnia.js",
        "sources": ["zinnia.js.cc"],
        "include_dirs": [
            "zinnia/zinnia/",
            "/usr/local/include/"
        ],
        "libraries": [
            "-Wl,-rpath,/usr/local/lib/",
            "/usr/local/lib/libzinnia.so"
        ]
    }]
}