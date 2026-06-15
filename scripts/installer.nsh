!macro customInstall
  ; Check if VC++ Redistributable is already installed
  ReadRegDWORD $0 HKLM "SOFTWARE\Microsoft\VisualStudio\14.0\VC\Runtimes\X64" "Installed"
  ${If} $0 != 1
    DetailPrint "Downloading Visual C++ Redistributable..."
    ${If} ${RunningX64}
      inetc::get "https://aka.ms/vs/17/release/vc_redist.x64.exe" "$TEMP\vc_redist.exe" /END
    ${Else}
      inetc::get "https://aka.ms/vs/17/release/vc_redist.arm64.exe" "$TEMP\vc_redist.exe" /END
    ${EndIf}
    Pop $0
    ${If} $0 == "OK"
      DetailPrint "Installing Visual C++ Redistributable..."
      nsExec::ExecToLog '"$TEMP\vc_redist.exe" /install /quiet /norestart'
      Pop $0
      DetailPrint "VC++ Redistributable install returned: $0"
    ${Else}
      DetailPrint "VC++ Redistributable download failed: $0"
      MessageBox MB_OK|MB_ICONEXCLAMATION "Visual C++ Redistributable download failed. Please install it manually from https://aka.ms/vs/17/release/vc_redist.x64.exe"
    ${EndIf}
    Delete "$TEMP\vc_redist.exe"
  ${Else}
    DetailPrint "Visual C++ Redistributable is already installed."
  ${EndIf}
!macroend
