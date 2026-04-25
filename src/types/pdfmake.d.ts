declare module "pdfmake/build/pdfmake" {
  const pdfMake: {
    vfs?: Record<string, string>
    addVirtualFileSystem?: (vfs: Record<string, string>) => void
    createPdf: (definition: unknown) => {
      getBuffer: (callback: (buffer: Uint8Array) => void) => void
    }
  }

  export default pdfMake
}

declare module "pdfmake/build/vfs_fonts" {
  const pdfFonts: Record<string, string> & {
    pdfMake?: {
      vfs: Record<string, string>
    }
    vfs?: Record<string, string>
  }

  export default pdfFonts
}
