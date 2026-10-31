package main

import (
	"embed"
	"fmt"
	"io/fs"
	"net"
	"net/http"
	"os"
	"path"
	"strings"
	"time"
)

//go:embed dist
var distFS embed.FS

// Puerto fijo: así el navegador guarda las reservas y platos entre una apertura y otra
const puerto = 47123
const firma = "kilimanjaro-app-ok"

func servidor() http.Handler {
	sub, _ := fs.Sub(distFS, "dist")
	files := http.FileServer(http.FS(sub))
	index, _ := fs.ReadFile(sub, "index.html")
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path == "/__kilimanjaro" {
			w.Write([]byte(firma))
			return
		}
		p := strings.TrimPrefix(path.Clean(r.URL.Path), "/")
		if p != "" {
			if f, err := sub.Open(p); err == nil {
				st, _ := f.Stat()
				f.Close()
				if !st.IsDir() {
					files.ServeHTTP(w, r)
					return
				}
			}
		}
		// Rutas de React Router (/panel, /menu, ...) -> index.html
		w.Header().Set("Content-Type", "text/html; charset=utf-8")
		w.Header().Set("Cache-Control", "no-cache")
		w.Write(index)
	})
}

// ¿Ya hay otra copia del programa abierta?
func yaAbierto(url string) bool {
	c := http.Client{Timeout: 800 * time.Millisecond}
	resp, err := c.Get(url + "__kilimanjaro")
	if err != nil {
		return false
	}
	defer resp.Body.Close()
	b := make([]byte, 64)
	n, _ := resp.Body.Read(b)
	return string(b[:n]) == firma
}

func main() {
	url := fmt.Sprintf("http://127.0.0.1:%d/", puerto)

	ln, err := net.Listen("tcp", fmt.Sprintf("127.0.0.1:%d", puerto))
	if err != nil {
		if yaAbierto(url) {
			// El programa ya está corriendo: solo abrimos otra ventana
			abrirVentana(url)
			return
		}
		// El puerto lo usa otro programa: usamos uno libre
		ln, err = net.Listen("tcp", "127.0.0.1:0")
		if err != nil {
			mensaje("No se pudo iniciar el sistema:\n" + err.Error())
			os.Exit(1)
		}
		url = fmt.Sprintf("http://127.0.0.1:%d/", ln.Addr().(*net.TCPAddr).Port)
	}

	go http.Serve(ln, servidor())

	// Abre la ventana del aplicativo y espera a que el usuario la cierre
	abrirVentana(url)
}
