const dayValue = document.querySelector('.days');
const monthValue = document.querySelector('.months');
const yearValue = document.querySelector('.years');
const submitBtn = document.querySelector('#submitBtn');

const fields = [
    { input: '#day',   label: '.day',   error: '.error1', invalidMsg: 'Must be a valid day' },
    { input: '#month', label: '.month', error: '.error2', invalidMsg: 'Must be a valid month' },
    { input: '#year',  label: '.year',  error: '.error3', invalidMsg: 'Must be in the past' },
];

function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function daysInMonth(month, year) {
    return [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1];
}

function setError(index, message) {
    const f = fields[index];
    document.querySelector(f.error).textContent = message;
    document.querySelector(f.error).style.display = 'block';
    document.querySelector(f.input).style.borderColor = 'red';
    document.querySelector(f.label).style.color = 'red';
}

function clearErrors() {
    fields.forEach(f => {
        document.querySelector(f.error).style.display = 'none';
        document.querySelector(f.input).style.borderColor = '';
        document.querySelector(f.label).style.color = '';
    });
}

submitBtn.addEventListener('click', function () {
    clearErrors();

    const rawValues = fields.map(f => document.querySelector(f.input).value.trim());
    const [day1, month1, year1] = rawValues.map(v => parseInt(v, 10));

    const today = new Date();
    const currentDay = today.getDate();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();

    let valid = true;

    // Required checks (all fields at once)
    rawValues.forEach((v, i) => {
        if (v === '' || isNaN(parseInt(v, 10))) {
            setError(i, 'This field is required');
            valid = false;
        }
    });
    if (!valid) return;

    // Range checks
    if (month1 < 1 || month1 > 12) {
        setError(1, fields[1].invalidMsg);
        valid = false;
    }
    if (year1 < 1 || year1 > currentYear) {
        setError(2, fields[2].invalidMsg);
        valid = false;
    }
    if (valid && (day1 < 1 || day1 > daysInMonth(month1, year1))) {
        setError(0, fields[0].invalidMsg);
        valid = false;
    }

    // Future-date check
    if (valid) {
        const birth = new Date(year1, month1 - 1, day1);
        if (birth > today) {
            setError(2, fields[2].invalidMsg);
            valid = false;
        }
    }

    if (!valid) return;

    // Calculate age
    let day = currentDay - day1;
    let month = currentMonth - month1;
    let year = currentYear - year1;

    if (day < 0) {
        // Borrow days from the previous calendar month
        const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1;
        const prevMonthYear = currentMonth === 1 ? currentYear - 1 : currentYear;
        day += daysInMonth(prevMonth, prevMonthYear);
        month -= 1;
    }
    if (month < 0) {
        month += 12;
        year -= 1;
    }

    // Pluralization
    document.querySelector('.third').style.display  = day === 1   ? 'none' : 'inline';
    document.querySelector('.second').style.display = month === 1 ? 'none' : 'inline';
    document.querySelector('.first').style.display  = year === 1  ? 'none' : 'inline';

    dayValue.textContent = day;
    monthValue.textContent = month;
    yearValue.textContent = year;
});