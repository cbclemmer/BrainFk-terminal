let ptr = 0 // Pointer to array
let arr = [0] // Memory array
let stdout = '' // Output that is meant to be transported elsewhere
let execute = false // Determines whether we are executing user code or machine code (true for machine code)

const commands = ['>', '<', '+', '-', '.', ',', '[', ']']

function command(cmd) {
    switch (cmd) {
        case ">": // Increment pointer
            ptr++
            if (arr[ptr] === undefined) arr.push(0)
            break
        case "<": // Decrement pointer
            if (ptr > 0) ptr--
            break
        case "+": // Increment value
            if (!arr[ptr]) arr[ptr] = 0
            if (arr[ptr] < 256)arr[ptr]++
            break
        case "-": // Decrement value
            if (arr[ptr] > 0) arr[ptr]--
            break
        case ".": // Output to stdout
            stdout += String.fromCharCode(arr[ptr] + 97)
            break
    }
}

process.stdin.setEncoding('utf8')

process.stdin.on('readable', () => {
    let chunk
    while ((chunk = process.stdin.read()) !== null) {
        if (chunk != null) chunk = chunk.trim()
        if (chunk.length === 0) continue
        if (chunk === 'clear') {
            ptr = 0
            arr = [0]
            stdout = ''
        } else {
            let indent = []
            for (var i = 0; i < chunk.length;i++) {
                switch (chunk[i]) {
                    case "[": // Begin loop
                        indent.push(i)
                        break
                    case "]": // End / Check loop
                        if (indent.length > 0 && arr[ptr] > 0) i = indent[indent.length - 1] + 1
                        break
                    case ",": // Start / Stop execution
                        execute = !execute
                        if (execute) {
                            let s = ''
                            let remaining = arr.slice(ptr)
                            for(let j = 0;j < remaining.length;j++) {
                                const r = remaining[j]
                                if (r < 7) s += commands[r]
                            }
                            chunk = s
                            i = 0
                        } else chunk = ''
                    default:
                        command(chunk[i])
                }
            }
            execute = false
        }

        console.log('\n\n\n\n\n\nptr: ' + ptr)
        console.log('val: ' + arr[ptr])
        console.log('stdout: ' + stdout)
        console.log('__________________')
        for (let i = 0;arr[i] != undefined;i++) {
            console.log('[' + i + ']: ' + (arr[i] < commands.length  ? commands[arr[i]] + ' ' : '') + arr[i])
        }
    }
})

process.stdin.on('end', () => {
  process.stdout.write('end')
})