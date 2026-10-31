//go:build windows

package main

import (
	"os"
	"os/exec"
	"path/filepath"
	"syscall"
	"time"
	"unsafe"
)

func mensaje(texto string) {
	user32 := syscall.NewLazyDLL("user32.dll")
	box := user32.NewProc("MessageBoxW")
	t, _ := syscall.UTF16PtrFromString(texto)
	c, _ := syscall.UTF16PtrFromString("Kilimanjaro")
	box.Call(0, uintptr(unsafe.Pointer(t)), uintptr(unsafe.Pointer(c)), 0x40)
}

// Busca Microsoft Edge (viene en todo Windows 10/11) o Google Chrome
func buscarNavegador() string {
	var rutas []string
	for _, env := range []string{"ProgramFiles(x86)", "ProgramFiles", "LocalAppData"} {
		base := os.Getenv(env)
		if base == "" {
			continue
		}
		rutas = append(rutas,
			filepath.Join(base, "Microsoft", "Edge", "Application", "msedge.exe"),
			filepath.Join(base, "Google", "Chrome", "Application", "chrome.exe"),
		)
	}
	for _, r := range rutas {
		if _, err := os.Stat(r); err == nil {
			return r
		}
	}
	return ""
}

func abrirVentana(url string) {
	nav := buscarNavegador()
	if nav == "" {
		// Sin Edge ni Chrome: se abre en el navegador predeterminado
		exec.Command("rundll32", "url.dll,FileProtocolHandler", url).Start()
		mensaje("El sistema se abrió en tu navegador.\n\nCuando termines, presiona Aceptar para cerrar el sistema.")
		return
	}

	// Perfil propio del aplicativo: guarda los datos entre usos
	perfil := filepath.Join(os.Getenv("LocalAppData"), "KilimanjaroApp")
	os.MkdirAll(perfil, 0o755)

	cmd := exec.Command(nav,
		"--app="+url,
		"--user-data-dir="+perfil,
		"--window-size=1360,860",
		"--no-first-run",
		"--no-default-browser-check",
		"--disable-sync",
		"--disable-features=msEdgeStartupBoost,msImplicitSignin,Translate",
	)
	if err := cmd.Start(); err != nil {
		exec.Command("rundll32", "url.dll,FileProtocolHandler", url).Start()
		mensaje("El sistema se abrió en tu navegador.\n\nCuando termines, presiona Aceptar para cerrar el sistema.")
		return
	}
	inicio := time.Now()
	cmd.Wait()
	// Si Edge devolvió el control enseguida (entregó la ventana a otro proceso),
	// el sistema sigue funcionando hasta que el usuario lo cierre.
	if time.Since(inicio) < 15*time.Second {
		mensaje("El sistema Kilimanjaro está abierto.\n\nCuando termines, presiona Aceptar para cerrarlo.")
	}
}
