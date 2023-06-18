package main

import (
	"fmt"
	"neveline_proxy/core/config"
	proxy "neveline_proxy/core/proxy"
	"os"
	"os/exec"
)

func main() {
	config := config.ReadConfig()
	proxy.OpenDb()

	fmt.Println("<< Neveline >> Http proxy started")

	go proxy.StartProxy(config)

	cmd := exec.Command("node", ".")
	cmd.Dir = "./core/bot"
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	cmd.Stdin = os.Stdin
	cmd.Run()
	fmt.Println(cmd.Stdout)

}
