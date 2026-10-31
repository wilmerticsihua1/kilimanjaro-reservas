//go:build !windows

package main

import (
	"fmt"
	"os"
	"os/signal"
)

func mensaje(texto string) { fmt.Println(texto) }

func abrirVentana(url string) {
	fmt.Println("Sistema en", url, "(Ctrl+C para salir)")
	c := make(chan os.Signal, 1)
	signal.Notify(c, os.Interrupt)
	<-c
}
