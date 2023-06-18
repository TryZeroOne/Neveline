package config

import (
	"fmt"
	"os"

	"gopkg.in/yaml.v2"
)

type Server struct {
	Ipv4  string `yaml:"Ipv4"`
	Port  string `yaml:"Port"`
	Debug bool   `yaml:"Debug"`
	Proxy Proxy  `yaml:"Proxy"`
}

type Proxy struct {
	HandshakeTimeout int `yaml:"HandshakeTimeout"`
}

type Config struct {
	Server Server `yaml:"Server"`
}

func ReadConfig() *Config {

	conf := &Config{}

	yamlFile, err := os.ReadFile("config.yml")

	if err != nil {
		fmt.Println("Can't read config: ", err.Error())
		return conf
	}

	err = yaml.Unmarshal(yamlFile, conf)
	if err != nil {
		fmt.Println("Can't unmarshal config: ", err.Error())
		return conf
	}

	return conf
}
