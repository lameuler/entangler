<script lang="ts">
    import TextInput from './TextInput.svelte';

    let text = ''

    export let time: Date = new Date()

    function parse(str: string) {
        const s = str.trim().toUpperCase()
        let stage = 0
        let hour = ''
        let sep = ''
        let minute = ''
        let amPm = ''
        for (const char of s) {
            console.log('char',char)
            hour: if (stage === 0) { // inputing hours
                if (hour.length === 2) {
                    stage = 1
                    break hour
                }
                if (hour.length > 0 && char === ':') {
                    stage = 1
                    sep = ':'
                    break hour
                }
                if (hour.length > 0 && 'AP'.includes(char)) {
                    stage = 2
                    break hour
                }
                const digit = Number(char)
                // console.log('h', digit, Number(hour + digit.toString()))
                if (isFinite(digit)) {
                    const result = Number(hour + digit.toString())
                    if (result < 24) {
                        hour = hour + digit.toString()
                    } else {
                        stage = 1
                    }
                }
            }
            min: if (stage === 1) { // inputing minutes
                if (minute.length === 2 || char === 'A' || char === 'P') {
                    if (minute.length === 1) minute = '0' + minute
                    stage = 2
                    break min
                }
                const digit = Number(char)
                console.log('m', digit, Number(minute + digit.toString()))
                if (isFinite(digit)) {
                    sep = ':'
                    const result = Number(minute + digit.toString())
                    if (result < 60) {
                        minute = minute + digit.toString()
                        if (result >= 6 && result <= 9 && minute.length === 1) minute = '0' + minute
                    } else {
                        stage = 2
                    }
                }
            }
            if (stage === 2) {
                if (amPm.length === 0 && (char === 'A' || char === 'P')) {
                    amPm += char
                } else if (amPm.length === 1 && char === 'M') {
                    amPm += char
                    break
                }
            }
        }
        return { hour, minute, sep, amPm }
    }

    function preprocess(str: string) {
        const { hour, minute, sep, amPm } = parse(str)

        return hour+sep+minute+amPm
    }

    function validator() {
        const res = parse(text)
        if (res.hour) {
            let h = Number(res.hour)
            if (h < 12 && res.amPm==='PM') {
                h += 12
            }
            if (h === 12 && res.amPm === 'AM') {
                h = 0
            }
            const m = Number(res.minute || '0')
            const d = new Date(time)
            d.setHours(h)
            d.setMinutes(m)
            d.setSeconds(0)
            d.setMilliseconds(0)
            time = d
        }
    }

    function update(t: Date) {
        let str = ''
        let h = t.getHours()
        let ap = 'AM'
        if (h >= 12) {
            ap = 'PM'
            if (h>12) h-=12
        } else {
            if (h===0) h+=12
        }
        str += h.toString()
        str += ':'
        let m = t.getMinutes().toString()
        switch (m.length) {
            case 0: str += '0'
            case 1: str += '0'
            case 2: str += m
        }
        str += ap
        text = str
    }

    $: update(time)
</script>

<TextInput bind:value={text} {preprocess} {validator} validateAfter={null}/>