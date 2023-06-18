package proxy

import "fmt"

func Catch() {
	if err := recover(); err != nil {
		fmt.Printf("<< Neveline >> Fatal Error: %v\n", err)
		return
	}
}
