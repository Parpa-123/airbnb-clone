Write-Host "Starting health pinger background worker..."
while ($true) {
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:8000/health/" -Method Get
        Write-Host "[$((Get-Date).ToString('yyyy-MM-dd HH:mm:ss'))] Health check pinged successfully. Status: $($response.status)"
    } catch {
        Write-Host "[$((Get-Date).ToString('yyyy-MM-dd HH:mm:ss'))] Failed to ping health endpoint: $($_.Exception.Message)"
    }
    Start-Sleep -Seconds 45
}
