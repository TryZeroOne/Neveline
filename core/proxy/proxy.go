package proxy

import (
	"bufio"
	"encoding/base64"
	"errors"
	"fmt"
	"net"
	"net/http"
	"neveline_proxy/core/config"
	"strings"
	"time"
)

type ProxyConn struct {
	conn   net.Conn
	req    *http.Request
	config *config.Config
}

func StartProxy(config *config.Config) error {
	proxy, err := net.Listen("tcp", config.Server.Ipv4+":"+config.Server.Port)
	if err != nil {
		return err
	}

	for {
		conn, err := proxy.Accept()
		if err != nil {
			continue
		}

		p, err := initReq(conn, config)
		if err != nil {
			continue
		}
		go p.handleConn()
	}
}

const handshakeTimeout = 5 * time.Second

func (p *ProxyConn) handleConn() {
	defer p.conn.Close()

	if p.config.Server.Debug {

		fmt.Printf("[ %s ] << Neveline  >> New connection: %s\n", time.Now().Format("15:04:05"), p.conn.RemoteAddr().String())
	}

	if !checkAuthorization(p.req) {

		response := "HTTP/1.1 407 Proxy Authentication Required\r\nProxy-Authenticate: Basic realm=\"Proxy Authentication\"\r\n\r\n"

		_, err := p.conn.Write([]byte(response))
		if err != nil {
			p.conn.Close()
			return
		}
		return
	}

	if p.req.Method == "CONNECT" {

		err := p.HandleHTTPS()
		if err != nil && p.config.Server.Debug {
			fmt.Printf("<< Neveline >> HTTPS Error: %v\n", err)
		}
		return
	} else {
		err := p.HandleHTTP()
		if err != nil && p.config.Server.Debug {
			fmt.Printf("<< Neveline >> HTTP Error: %v\n", err)
		}
	}

}

func checkAuthorization(r *http.Request) bool {

	pass := r.Header.Get("Proxy-Authorization")

	new := strings.Trim(pass, "Basic ")

	decodedBytes, err := base64.StdEncoding.DecodeString(new)
	if err != nil {
		return false
	}

	splitted := strings.Split(string(decodedBytes), ":")

	if len(splitted) != 2 {
		return false
	}

	return CheckUser(splitted[0], splitted[1])
}

func initReq(conn net.Conn, config *config.Config) (*ProxyConn, error) {

	conn.SetReadDeadline(time.Now().Add(handshakeTimeout))

	req, err := http.ReadRequest(bufio.NewReader(conn))
	if err != nil && !errors.Is(err, errors.New("EOF")) {
		if config.Server.Debug {
			fmt.Printf("<< Neveline >> Can't read request: %v\n", err)
		}
		return &ProxyConn{}, err
	}
	conn.SetReadDeadline(time.Time{})

	return &ProxyConn{
		config: config,
		conn:   conn,
		req:    req,
	}, nil

}
