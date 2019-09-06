const fs = require('fs')

// TODO
// ,,+--+ should start program on address 9
// >>+-+-- should jump to addrees 20

let ptr = 0 // Pointer to array
let arr = [0] // Memory array
let stdout = '' // Output that is meant to be transported elsewhere
let execute = false // Determines whether we are executing user code or machine code (true for machine code)

try {
    const f = fs.readFileSync('./data.dat').toString()
    arr = f.split(',')
} catch (e) {
    console.error('Data not found: ' + e)
}

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

function processChunk(chunk) {
    if (chunk != null) chunk = chunk.trim()
    if (chunk.length === 0) return
    if (chunk === 'clear') {
        ptr = 0
        arr = [0]
        stdout = ''
        return
    }
    if (chunk === 'save') {
        try {
            fs.writeFileSync('./data.dat', arr.toString())
            console.log('Saved Successfully')
        } catch (e) {
            console.error(e)
        }
        return
    }
    let indent = []
    for (var i = 0; i < chunk.length;i++) {
        switch (chunk[i]) {
            case "[": // Begin loop
                indent.push(i)
                break
            case "]": // End / Check loop
                if (indent.length > 0 && arr[ptr] > 0) i = indent[indent.length - 1]
                else indent.pop()
                break
            case ",": // Start / Stop execution
                // if (execute) {
                // } else {
                //     execute = true
                //     let addr = 0
                //     for (let j = 8; j > 0;j--) {
                //         if (chunk[i + j] !== '+' && chunk[i + j] !== '-') break
                //         addr += chunk[i + j] === '+' ? Math.pow(2, j) : 0
                //     }

                // }
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

function logDataTable() {
    console.log('\n\n\n\n\n\nptr: ' + ptr)
    console.log('val: ' + arr[ptr])
    console.log('stdout: ' + stdout)
    console.log('__________________')
    for (let i = ptr;i < ptr + 16;i++) {
        if (arr[i] === undefined) arr.push(0)
        let bin = parseInt(arr[i]).toString(2)
        const len = bin.length
        for (let j = 0;j < 8 - len;j++) {
            bin = '0' + bin
        }
        let addr = i.toString(16)
        let addrLen = addr.length
        for (let j = 0;j < 2 - addrLen;j++) {
            addr = '0' + addr
        }

        num = arr[i].toString()
        let numLen = num.length
        for (let j = 0;j < 3 - numLen;j++) {
            num = '0' + num
        }

        console.log('[0x' + addr + ']: ' + bin + 'B ' + num + 'D #' + (arr[i] < commands.length  ? commands[arr[i]] + ' ' : ''))
    }
}

process.stdin.setEncoding('utf8')

process.stdin.on('readable', () => {
    let chunk
    while ((chunk = process.stdin.read()) !== null) {
        processChunk(chunk)
        logDataTable()
    }
})

process.stdin.on('end', () => {
  process.stdout.write('end')
})