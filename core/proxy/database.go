package proxy

import (
	"database/sql"
	"fmt"
	"os"

	_ "github.com/mattn/go-sqlite3"
)

var Db *sql.DB

func OpenDb() {
	var err error

	Db, err = sql.Open("sqlite3", "./db.sqlite3")
	if err != nil {
		os.Create("./db.sqlite3")
		Db, err = sql.Open("sqlite3", "./db.sqlite3")
		if err != nil {
			fmt.Println("<< Neveline >> Can't open db.sqlite3")
		}
	}

}

// true - ok
func CheckUser(login, password string) bool {
	rows, err := Db.Query("SELECT login, password FROM users WHERE login=? AND password=?", login, password)

	if err != nil {
		fmt.Println("<< Neveline >> Database error:  " + err.Error())
		return false
	}

	defer rows.Close()

	for rows.Next() {
		var _login string
		var _password string

		rows.Scan(&_login, &_password)
		return true
	}
	return false
}

func CheckUrl(url string) bool {
	rows, err := Db.Query("SELECT url FROM urlBlacklist WHERE url=?", url)

	if err != nil {
		fmt.Println("<< Neveline >> Database error:  " + err.Error())
		return false
	}

	defer rows.Close()

	for rows.Next() {
		var _url string

		rows.Scan(&_url)
		return true
	}
	return false

}
