function Get-Frontmatter {
    param([string]$FilePath)
    $content = Get-Content $FilePath -Raw
    $regex = "^---`r?`n([\s\S]+?)`r?`n---`r?`n?([\s\S]*)$"
    if ($content -match $regex) {
        $yamlPart = $Matches[1]
        $bodyPart = $Matches[2].Trim()
        $data = @{}
        $yamlPart -split "`n" | ForEach-Object {
            if ($_ -match "^\s*([\w\-]+):\s*(.*)$") {
                $key = $Matches[1].Trim()
                $val = $Matches[2].Trim()
                if ($val -match "^[`"'](.*)[`"']$") { $val = $Matches[1] }
                # Handle lists like - item
                $data[$key] = $val
            }
        }
        return [PSCustomObject]@{
            data = $data
            content = $bodyPart
        }
    }
    return $null
}

$categories = @("blog", "publications", "research", "team")

foreach ($cat in $categories) {
    $results = @()
    $files = Get-ChildItem -Path "E:\bak institute\content\$cat" -Filter *.md
    foreach ($file in $files) {
        $meta = Get-Frontmatter $file.FullName
        if ($meta) {
            $obj = $meta.data
            $obj["body"] = $meta.content
            $results += $obj
        }
    }
    $results | ConvertTo-Json -Depth 5 | Out-File "E:\bak institute\data\$cat.json" -Encoding utf8
}

Write-Host "JSON conversion complete!"
