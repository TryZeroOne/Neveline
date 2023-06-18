package proxy

import (
	"errors"
	"io"
	"net"
	"time"
)

func (p *ProxyConn) HandleHTTPS() error {

	port := p.req.URL.Port()
	if port == "" {
		port = "443"
	}
	if CheckUrl(p.req.URL.Hostname()) {
		p.conn.Close()
		return errors.New("Blacklisted url: " + p.req.URL.Hostname())
	}

	dst, e := net.DialTimeout("tcp", net.JoinHostPort(p.req.URL.Hostname(), port), handshakeTimeout)
	if e != nil {
		return e
	}
	defer dst.Close()

	_, err := p.conn.Write([]byte(p.req.Proto + " 200 Connection established\r\n\r\n"))
	if err != nil {
		return err
	}

	go func() {
		defer dst.Close()
		defer p.conn.Close()
		io.Copy(dst, p.conn)
		dst.SetReadDeadline(time.Now().Add(5 * time.Second))
	}()
	io.Copy(p.conn, dst)
	p.conn.SetDeadline(time.Now().Add(5 * time.Second))

	return nil
}

func (p *ProxyConn) HandleHTTP() error {

	port := p.req.URL.Port()
	if port == "" {
		port = "80"
	}

	if CheckUrl(p.req.URL.Hostname()) {
		p.conn.Close()
		return errors.New("Blacklisted url: " + p.req.URL.Hostname())
	}

	dst, err := net.DialTimeout("tcp", net.JoinHostPort(p.req.URL.Hostname(), port), 5*time.Second)
	if err != nil {
		return err
	}
	defer dst.Close()

	err = p.req.Write(dst)
	if err != nil {
		return err
	}

	go func() {
		defer dst.Close()
		defer p.conn.Close()
		io.Copy(dst, p.conn)
		dst.SetReadDeadline(time.Now().Add(5 * time.Second))
	}()
	io.Copy(p.conn, dst)
	p.conn.SetDeadline(time.Now().Add(5 * time.Second))

	return nil

}
