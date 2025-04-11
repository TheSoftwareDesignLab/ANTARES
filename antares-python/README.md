# antares-python

[![CI](https://github.com/ANTARES/antares-python/actions/workflows/python-ci.yml/badge.svg)](https://github.com/ANTARES/antares-python/actions/workflows/python-ci.yml)
[![codecov](https://img.shields.io/badge/coverage-80%25-brightgreen)](https://github.com/ANTARES/antares-python)
[![PyPI version](https://img.shields.io/pypi/v/antares-python.svg)](https://pypi.org/project/antares-python/)
[![Python version](https://img.shields.io/pypi/pyversions/antares-python)](https://pypi.org/project/antares-python/)
[![License](https://img.shields.io/github/license/ANTARES/antares-python)](LICENSE)

> Python interface for the [Antares](https://github.com/ANTARES/antares) simulation software

`antares-python` is a facade library that allows Python developers to interact with the Antares simulation engine via HTTP. It provides a clean, user-friendly API for submitting simulations, retrieving results, and managing scenarios — similar to how `pyspark` interfaces with Apache Spark.

---

## 🚀 Features

- 🔁 Async + sync HTTP client
- 🔒 Typed schema validation (coming soon)
- 📦 Built-in support for data serialization
- 🧪 Fully testable with mocks
- 🛠️ First-class CLI support (planned)

---

## 📦 Installation

```bash
pip install antares-python
```

---

## ⚡ Quickstart

```python
from antares import AntaresClient

client = AntaresClient(base_url="http://localhost:8000")

# Submit a simulation
result = client.run_simulation(config={...})
print(result.metrics)
```

---

## 📚 Documentation

_Work in progress — full API docs coming soon._

---

## 🧪 Development

To set up a local development environment:

```bash
uv venv
source .venv/bin/activate
uv pip install -e .[dev]
task check
```

---

## 🧾 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
