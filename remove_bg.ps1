Add-Type -AssemblyName System.Drawing

$inputPath = "d:\Projects\horrorkingdom\public\logo.jpg"
$outputPath = "d:\Projects\horrorkingdom\public\logo.png"

try {
    $image = [System.Drawing.Bitmap]::FromFile($inputPath)
    $bmp = New-Object System.Drawing.Bitmap($image.Width, $image.Height)
    $graphics = [System.Drawing.Graphics]::FromImage($bmp)
    
    # Create a color matrix to make black transparent
    # This is a simple approximation. For better results, we iterate pixels.
    # Iterating pixels in PowerShell is slow, but for a logo it might be okay.
    
    $graphics.DrawImage($image, 0, 0, $image.Width, $image.Height)
    $graphics.Dispose()
    
    for ($x = 0; $x -lt $bmp.Width; $x++) {
        for ($y = 0; $y -lt $bmp.Height; $y++) {
            $pixel = $bmp.GetPixel($x, $y)
            # Check if pixel is dark (close to black)
            if ($pixel.R -lt 30 -and $pixel.G -lt 30 -and $pixel.B -lt 30) {
                $bmp.SetPixel($x, $y, [System.Drawing.Color]::Transparent)
            }
        }
    }

    $bmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $image.Dispose()
    $bmp.Dispose()
    Write-Host "Successfully saved transparent image to $outputPath"
}
catch {
    Write-Error "Error processing image: $_"
    exit 1
}
