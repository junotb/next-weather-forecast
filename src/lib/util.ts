const formatTime = (hhmm: string) => {
    if (!/^\d{4}$/.test(hhmm)) {
        throw new Error("Invalid input format. Expected 'hhmm' as a 4-digit string.");
    }
    
    let hh = hhmm.slice(0, 2); // 앞 2자리 (시간)
    let mm = hhmm.slice(2, 4); // 뒤 2자리 (분)
    
    return `${hh}:${mm}`;
}

export { formatTime };