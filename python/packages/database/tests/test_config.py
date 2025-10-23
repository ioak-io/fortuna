from package_database.config import DBSettings


def test_dsn_from_components_default():
    s = DBSettings(
        url=None,
        host="localhost",
        port=5432,
        user="postgres",
        password="postgres",
        dbname="postgres",
        sslmode=None,
    )
    assert (
        s.dsn
        == "postgresql://postgres:postgres@localhost:5432/postgres"
    )


def test_dsn_with_sslmode():
    s = DBSettings(url=None, sslmode="require")
    assert "sslmode=require" in s.dsn


def test_dsn_from_url_takes_precedence():
    s = DBSettings(url="postgresql://u:p@h:5432/db?sslmode=require")
    assert s.dsn == "postgresql://u:p@h:5432/db?sslmode=require"
