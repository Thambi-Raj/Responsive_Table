class Table {
    static previous = '';
    constructor(heading, data, i, color) {
        this.heading = heading;
        this.header = Object.keys(data[0]);
        this.values = Object.values(data[0]);
        this.previous_sorted_icon_clicked = -1;
        this.contentdiv = document.getElementsByClassName('content')[0];
        this.trmplate = document.getElementsByClassName('temp')[0];
        this.temp = this.trmplate.cloneNode(true);
        this.temp.setAttribute('class', 'first');
        this.temp.setAttribute('id', this.heading);
        this.contentdiv.appendChild(this.temp);
        this.headerdiv = document.getElementsByClassName('tablehead')[i];
        this.headerdiv.innerHTML = this.heading;
        this.tablecontent = document.getElementsByClassName('table-content')[i];
        this.footer = document.getElementsByClassName('footer')[i];
        this.first = document.getElementsByClassName('first')[i];
        this.data = data;
        this.color = color;
        this.i = i;
        this.row = document.getElementsByClassName('footer')[this.i].querySelector('select');
        this.first = document.getElementsByClassName('first')[this.i];

        this.Pagination(this.data, this.row, 1)
        this.changeEvent(this.row);
        this.pagedata = [...this.data];
        this.currentdata = this.data;
        this.addHeader_to_dashboard();
        if (this.i == 1) {
            this.temp.classList.add('showing');
            Table.previous = this.heading;
            document.querySelectorAll('.' + this.heading)[0].classList.add('backdiv');
        }
        this.rowflex = '';
        this.scroll = document.getElementsByClassName('page')[this.i].getElementsByClassName('scroll')
        this.scroll[1].addEventListener('click', this.back.bind(this));
        this.scroll[0].addEventListener('click', this.prev.bind(this));
        this.removeTable = this.removeTable.bind(this);
        this.addTable = this.addTable.bind(this);
        const clickableElements = document.querySelectorAll('.divi');
        clickableElements.forEach(element => {
            element.addEventListener('click', () => {
                this.handleElementClick(element);
            });
        });
    }
    handleElementClick(element) {
        this.removeTable(Table.previous);
        this.addTable(element.innerText);
        Table.previous = element.innerText;
    }
    removeTable(id) {
        document.querySelectorAll('.' + id)[0].classList.remove('backdiv');
        document.getElementById(id).classList.remove('showing');
    }
    addTable(id) {
        document.querySelectorAll('.' + id)[0].classList.add('backdiv');
        document.getElementById(id).classList.add('showing');
    }
    addHeader_to_dashboard() {
        var head = document.getElementsByClassName('tab')[0];
        var div = document.createElement('div');
        var newClassName = 'divi ' + this.heading;
        div.setAttribute('class', newClassName);
        var p = document.createElement('p');
        p.innerText = this.heading;
        div.appendChild(p);
        head.appendChild(div);
    }
    changeEvent(row) {
        row.addEventListener('change', () => {
            var r = this.row.value;
            var pagebutton = document.getElementsByClassName('page')[this.i];
            pagebutton.children[2].setAttribute('class', 'f scroll ');
            if (this.row.value == 'All') {
                r = this.currentdata.length;
                pagebutton.classList.add('none1');
            }
            else {
                pagebutton.children[1].innerText = 1;
                let length1 = this.currentdata.length % this.row.value == 0 ? this.currentdata.length / this.row.value : Math.ceil(this.currentdata.length / this.row.value);
                if (length1 > 1) {
                    pagebutton.classList.remove('none1');
                }
                else {
                    pagebutton.classList.add('none1');
                }
            }
            this.addData_to_row(this.currentdata, 0, r);
        })
    }
    Pagination(datas, values, start) {
        if (values.value == 'All') {
            values = datas.length;
        } else {
            values = parseInt(values.value);
        }
        var s = start * values - values;
        var end = (start * values - values) + values;
        var pagebutton = document.getElementsByClassName('page')[this.i];
        pagebutton.children[1].innerText = 1;
        this.addData_to_row(datas, s, end);
    }
    back() {
        let length1 = this.currentdata.length % this.row.value == 0 ? this.currentdata.length / this.row.value : Math.ceil(this.currentdata.length / this.row.value);
        var pagebutton = document.getElementsByClassName('page')[this.i];
        var number = parseInt(pagebutton.children[1].innerText) + 1;
        if (number <= length1) {
            pagebutton.children[0].setAttribute('class', 'f scroll');
            pagebutton.children[1].innerText = number;
            this.addData_to_row(this.currentdata, (number) * this.row.value - this.row.value, (number) * this.row.value);
        }
        if (number == length1) {
            pagebutton.children[2].setAttribute('class', 'f scroll blur');
        }
    }
    prev() {
        var pagebutton = document.getElementsByClassName('page')[this.i];
        var number = parseInt(pagebutton.children[1].innerText) - 1;
        if (number > 0) {
            pagebutton.children[2].setAttribute('class', 'f scroll');
            pagebutton.children[1].innerText = number;
            this.addData_to_row(this.currentdata, (number) * this.row.value - this.row.value, (number) * this.row.value);
        }
        else {
            pagebutton.children[0].setAttribute('class', 'f scroll blur');
        }
    }
    addData_to_row(datas, start, end) {
        var table = this.tablecontent.querySelector('table');
        var t = table.querySelectorAll('tr');
        var t1 = t[1];
        if (t1 != null) {
            for (var i = t.length - 1; i >= 1; i--) {
                table.deleteRow(i);
            }
        }
        var tbody = document.createElement('tbody');
        for (var i = start; i < Math.min(end, datas.length); i++) {

            this.addData_to_cell(datas[i], tbody);
        }
        this.tablecontent.querySelector('table').appendChild(tbody);
    }
    addData_to_cell(Jsondata, tbody) {
        var tr = document.createElement('tr');
        Object.keys(Jsondata).forEach(element => {
            var td = document.createElement('td');
            td.innerHTML = Jsondata[element];
            td.setAttribute('class', 'trpadding')
            if (typeof Jsondata[element] == 'string') {
                if (this.color[Jsondata[element]]) {
                    td.style.color = this.color[Jsondata[element]];
                }
                td.setAttribute('class', 'trpadding centeralign');
            }
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    }
    sortenable(Array, filter) {
        var returnArray = [];
        var tr = document.createElement('tr');
        var i = 0;
        Array.forEach(element => {
            var th = document.createElement('th');
            var div = document.createElement('div');
            var p = document.createElement('p');
            var first_letter_upper = element.replace('_', '');
            first_letter_upper = first_letter_upper.charAt(0).toUpperCase() + first_letter_upper.substr(1);
            p.innerText = first_letter_upper;
            var p1 = document.createElement('i');
            p1.setAttribute('class', 'fa fa-unsorted')
            div.appendChild(p);
            div.appendChild(p1);
            div.setAttribute('class', 'rowflex');
            returnArray.push(div);
            ((element, i) => {
                element.addEventListener('click', () => {
                    this.sorting([...this.currentdata], i, element);
                })
            })(div, i);
            i++;
            th.appendChild(div);
            tr.appendChild(th);
        });
        if (filter !== 'indirect') {
            var thead = document.createElement('thead');
            thead.appendChild(tr);
            document.getElementsByClassName('table-content')[this.i].querySelector('table').appendChild(thead);
            this.rowflex = document.getElementsByTagName('thead')[this.i - 1].querySelectorAll('th');
        }
        return returnArray;
    }
    filter() {
        var array = this.sortenable(this.header, 'indirect');
        var tr = document.createElement('tr');
        var i = 0;
        array.forEach(element => {
            var div = document.createElement('div');
            var input = document.createElement('input');
            var th = document.createElement('th');
            div.append(element);
            div.appendChild(input);
            div.setAttribute('class', 'filter');
            typeof this.values[i] == 'number' ? input.setAttribute('class', 'numinput') : console.log('notokey');;
            th.appendChild(div)
            tr.appendChild(th);
            typeof this.values[i] == 'string' ? input.placeholder = 'ex : ' + this.values[i] : input.placeholder = 'ex :>' + this.values[i];
            tr.setAttribute('class', 'trfixed');
            this.InputEvent(input);
            i++;
        });
        var thead = document.createElement('thead');
        thead.appendChild(tr);
        document.getElementsByClassName('table-content')[this.i].querySelector('table').appendChild(thead);
        this.rowflex = document.getElementsByTagName('thead')[this.i - 1].querySelectorAll('th');
    }
    InputEvent(input) {
        input.addEventListener('keyup', () => {
            var checkingcondition = [];
            var Allinput = (this.tablecontent.querySelectorAll('input'));
            var i = 0;
            Allinput.forEach(element => {
                var data = '';
                if (element.value != 0) {
                    if (typeof this.values[i] == 'number') {
                        if (/^[a-zA-Z]+$/.test(element.value)) {
                            alert('please enter a valid input')
                            element.value = '';
                        }
                        else {
                            data = i + '..' + element.value;
                            checkingcondition.push(data);
                        }
                    }
                    else {
                        data = i + '..' + element.value;
                        checkingcondition.push(data);
                    }
                }
                i++;
            });
            this.conditionCheck(checkingcondition);
        })
    }
    conditionCheck(condition) {
        var result = this.data;
        var tot = [];
        for (var i = 0; i < condition.length; i++) {
            var t = condition[i].split('..');
            var con = [];
            con.push(t[0]);
            if (t[1].includes('<')) {
               this.greater_less_than_condition(con,t);
            }
            else if (t[1].includes('>')) {
                this.greater_less_than_condition(con,t);
            }
            else if (t[1].includes('-')) {
                var val = t[1].split(/([^\w\d])|(\d+)/).filter(Boolean);
                if (val.length == 3) {
                    this.range_condition(val[1],val[0],val[2],con);
                }
                else if (val.length == 2) {
                    if (t[1].charAt(0) == '-') {
                        this.range_condition(val[0],0,val[1],con);
                    }
                    else {
                        this.range_condition(val[1],val[0],result.length,con);
                    }
                }
            }
            else if (/^[a-zA-Z]+$/.test(t[1])) {
                con.push(t[1]);
            }
            else {
                con.push(t[1]);
            }
            console.log(con);
            tot.push(con);
        }
        result = this.checkingArray(tot, this.data);
        this.currentdata = result;
        var pagebutton = document.getElementsByClassName('page')[this.i];
        pagebutton.children[2].setAttribute('class', 'f scroll ');
        if (result.length <= this.row.value || this.row.value == 'All') {
            pagebutton.classList.add('none1');
        }
        else {
            pagebutton.classList.remove('none1');
        }
        this.Pagination(result, this.row, 1);
    }
    greater_less_than_condition(con,t){
        var val = t[1].split(/([^\w\d])|(\d+)/).filter(Boolean);
        if (val.length == 2) {
            con.push(val[0]);
            con.push(val[1]);
        }
    }
    range_condition(start,symbol,end,con){
        con.push(start);
        con.push(symbol);
        con.push(end);
    }
    checkingArray(tot, result) {
        tot.forEach(element => {
            result = result.filter(function (user) {
                let headerKeys = Object.keys(result[0]);
                switch (element[1]) {
                    case '>':
                        return user[headerKeys[element[0]]] > element[2];
                    case '<':
                        return user[headerKeys[element[0]]] < element[2];
                    case '-':
                        return user[headerKeys[element[0]]] >= element[2] && user[headerKeys[element[0]]] <= element[3];
                    default:
                        return /^[a-zA-Z]+$/.test(user[headerKeys[element[0]]]) ? user[headerKeys[element[0]]].toUpperCase().includes((element[1]).toUpperCase()) : user[headerKeys[element[0]]] == element[1];
                }
            });
        })
        return result;
    }
    sorting(datas, i, element) {
        if (element.querySelector('i').classList[1] == 'fa-unsorted') {
            this.sort_icon('fa fa-sort-asc fa-color', element);
            this.sort_function(datas, this.header[i], 'asc');
        }
        else if (element.querySelector('i').classList[1] == 'fa-sort-asc') {
            this.sort_icon('fa fa-sort-desc fa-color', element);
            this.sort_function(datas, this.header[i], 'desc');
        }
        else {
            this.sort_icon('fa fa-unsorted ', element);
            this.sort_function(datas, this.header[i], 'unorder');
        }
        if (this.previous_sorted_icon_clicked != -1 && this.previous_sorted_icon_clicked != i) {
            var element1 = this.rowflex[this.previous_sorted_icon_clicked].querySelectorAll('.rowflex')[this.previous_sorted_icon_clicked];
            this.sort_icon('fa fa-unsorted', element1);
        }
        this.previous_sorted_icon_clicked = i;
    }
    sort_icon(classname, element) {
        element.querySelector('i').remove();
        var pk = document.createElement('i');
        pk.setAttribute('class', classname);
        element.appendChild(pk);
    }
    sort_function(datas, columnName, order) {
        datas.sort(function (a, b) {
            var valueA = typeof a[columnName] === 'string' ? a[columnName].toUpperCase() : a[columnName];
            var valueB = typeof b[columnName] === 'string' ? b[columnName].toUpperCase() : b[columnName];
            if (order == 'asc') {
                return valueA.localeCompare ? valueA.localeCompare(valueB) : valueA - valueB;
            }
            else if (order == 'desc') {
                return valueB.localeCompare ? valueB.localeCompare(valueA) : valueB - valueA;;
            }
        });
        this.Pagination(datas, this.row, 1);
    }
}
const data = [{ "id": 1, "first_name": "Bond", "tamil": 22, "english": 38, "science": 90, "social": 31, "maths": 88, "percentage": 28 },
{ "id": 2, "first_name": "Benetta", "tamil": 23, "english": 68, "science": 18, "social": 11, "maths": 77, "percentage": 76 },
{ "id": 3, "first_name": "Godart", "tamil": 67, "english": 54, "science": 35, "social": 80, "maths": 83, "percentage": 96 },
{ "id": 4, "first_name": "Mahalia", "tamil": 70, "english": 59, "science": 65, "social": 73, "maths": 93, "percentage": 19 },
{ "id": 5, "first_name": "Odessa", "tamil": 96, "english": 3, "science": 31, "social": 13, "maths": 78, "percentage": 4 },
{ "id": 6, "first_name": "Janeva", "tamil": 7, "english": 51, "science": 54, "social": 60, "maths": 48, "percentage": 60 },
{ "id": 7, "first_name": "Cobb", "tamil": 6, "english": 81, "science": 93, "social": 69, "maths": 19, "percentage": 38 },
{ "id": 8, "first_name": "Svend", "tamil": 42, "english": 95, "science": 36, "social": 71, "maths": 21, "percentage": 2 },
{ "id": 9, "first_name": "Nicol", "tamil": 96, "english": 14, "science": 41, "social": 5, "maths": 13, "percentage": 70 },
{ "id": 10, "first_name": "Kettie", "tamil": 58, "english": 4, "science": 64, "social": 58, "maths": 19, "percentage": 46 },
{ "id": 11, "first_name": "Wye", "tamil": 69, "english": 97, "science": 21, "social": 38, "maths": 76, "percentage": 43 },
{ "id": 12, "first_name": "Gizela", "tamil": 81, "english": 30, "science": 89, "social": 44, "maths": 16, "percentage": 47 },
{ "id": 13, "first_name": "Katharyn", "tamil": 13, "english": 22, "science": 48, "social": 67, "maths": 28, "percentage": 12 },
{ "id": 14, "first_name": "Mindy", "tamil": 45, "english": 18, "science": 34, "social": 53, "maths": 13, "percentage": 92 },
{ "id": 15, "first_name": "Averil", "tamil": 94, "english": 25, "science": 81, "social": 63, "maths": 30, "percentage": 31 },
{ "id": 16, "first_name": "Corrine", "tamil": 43, "english": 35, "science": 98, "social": 25, "maths": 39, "percentage": 43 },
{ "id": 17, "first_name": "Colleen", "tamil": 14, "english": 82, "science": 60, "social": 9, "maths": 58, "percentage": 60 },
{ "id": 18, "first_name": "Jacky", "tamil": 89, "english": 55, "science": 21, "social": 24, "maths": 50, "percentage": 17 },
{ "id": 19, "first_name": "Brendis", "tamil": 79, "english": 30, "science": 60, "social": 96, "maths": 17, "percentage": 85 },
{ "id": 20, "first_name": "Nikola", "tamil": 84, "english": 39, "science": 74, "social": 93, "maths": 80, "percentage": 83 },
{ "id": 21, "first_name": "Anne-marie", "tamil": 72, "english": 37, "science": 12, "social": 24, "maths": 93, "percentage": 22 },
{ "id": 22, "first_name": "Kellen", "tamil": 39, "english": 68, "science": 9, "social": 58, "maths": 50, "percentage": 96 },
{ "id": 23, "first_name": "Darryl", "tamil": 43, "english": 40, "science": 97, "social": 51, "maths": 36, "percentage": 99 },
{ "id": 24, "first_name": "Cale", "tamil": 77, "english": 95, "science": 47, "social": 37, "maths": 2, "percentage": 36 },
{ "id": 25, "first_name": "Zondra", "tamil": 80, "english": 73, "science": 84, "social": 40, "maths": 57, "percentage": 24 },
{ "id": 26, "first_name": "Darcy", "tamil": 21, "english": 42, "science": 13, "social": 88, "maths": 12, "percentage": 68 },
{ "id": 27, "first_name": "Elly", "tamil": 98, "english": 99, "science": 64, "social": 84, "maths": 54, "percentage": 64 },
{ "id": 28, "first_name": "Barnard", "tamil": 81, "english": 27, "science": 42, "social": 58, "maths": 55, "percentage": 12 },
{ "id": 29, "first_name": "Doreen", "tamil": 78, "english": 26, "science": 83, "social": 35, "maths": 32, "percentage": 72 },
{ "id": 30, "first_name": "Bernetta", "tamil": 96, "english": 73, "science": 17, "social": 38, "maths": 72, "percentage": 95 },
{ "id": 31, "first_name": "Bentley", "tamil": 48, "english": 22, "science": 77, "social": 2, "maths": 13, "percentage": 84 },
{ "id": 32, "first_name": "Babara", "tamil": 88, "english": 61, "science": 20, "social": 10, "maths": 85, "percentage": 3 },
{ "id": 33, "first_name": "Harris", "tamil": 55, "english": 87, "science": 42, "social": 72, "maths": 90, "percentage": 73 },
{ "id": 34, "first_name": "Grier", "tamil": 77, "english": 77, "science": 16, "social": 3, "maths": 46, "percentage": 32 },
{ "id": 35, "first_name": "Orsa", "tamil": 15, "english": 58, "science": 57, "social": 34, "maths": 36, "percentage": 19 },
{ "id": 36, "first_name": "Estella", "tamil": 93, "english": 61, "science": 5, "social": 36, "maths": 35, "percentage": 10 },
{ "id": 37, "first_name": "Marian", "tamil": 23, "english": 11, "science": 98, "social": 48, "maths": 28, "percentage": 59 },
{ "id": 38, "first_name": "Liuka", "tamil": 57, "english": 56, "science": 14, "social": 81, "maths": 6, "percentage": 44 },
{ "id": 39, "first_name": "Guillermo", "tamil": 12, "english": 23, "science": 99, "social": 61, "maths": 25, "percentage": 40 },
{ "id": 40, "first_name": "Almire", "tamil": 40, "english": 67, "science": 62, "social": 51, "maths": 14, "percentage": 45 },
{ "id": 41, "first_name": "Syman", "tamil": 87, "english": 48, "science": 49, "social": 60, "maths": 94, "percentage": 53 },
{ "id": 42, "first_name": "Gabey", "tamil": 57, "english": 22, "science": 66, "social": 3, "maths": 96, "percentage": 72 },
{ "id": 43, "first_name": "Armstrong", "tamil": 52, "english": 100, "science": 65, "social": 63, "maths": 7, "percentage": 77 },
{ "id": 44, "first_name": "Ruthanne", "tamil": 70, "english": 62, "science": 17, "social": 27, "maths": 46, "percentage": 96 },
{ "id": 45, "first_name": "Minerva", "tamil": 9, "english": 44, "science": 91, "social": 76, "maths": 60, "percentage": 55 },
{ "id": 46, "first_name": "Angela", "tamil": 39, "english": 67, "science": 10, "social": 83, "maths": 97, "percentage": 99 },
{ "id": 47, "first_name": "Curtice", "tamil": 40, "english": 12, "science": 63, "social": 35, "maths": 83, "percentage": 2 },
{ "id": 48, "first_name": "Arlyne", "tamil": 56, "english": 32, "science": 60, "social": 1, "maths": 2, "percentage": 66 },
{ "id": 49, "first_name": "Benetta", "tamil": 40, "english": 50, "science": 56, "social": 90, "maths": 26, "percentage": 70 },
{ "id": 50, "first_name": "Esmaria", "tamil": 88, "english": 78, "science": 40, "social": 49, "maths": 74, "percentage": 31 }
]
const food = [
    {
        "ingredientName": "Chicken Breast",
        "weight": 150,
        "calories": 165,
        "foodClassification": "Protein"
    },
    {
        "ingredientName": "Salmon",
        "weight": 120,
        "calories": 206,
        "foodClassification": "Protein"
    },
    {
        "ingredientName": "Almonds",
        "weight": 30,
        "calories": 180,
        "foodClassification": "Fats"
    },
    {
        "ingredientName": "Greek Yogurt",
        "weight": 150,
        "calories": 100,
        "foodClassification": "Carbs"
    },
    {
        "ingredientName": "Sweet Potato",
        "weight": 150,
        "calories": 112,
        "foodClassification": "Carbs"
    },
    {
        "ingredientName": "Egg",
        "weight": 50,
        "calories": 68,
        "foodClassification": "Protein"
    },
    {
        "ingredientName": "Tofu",
        "weight": 100,
        "calories": 144,
        "foodClassification": "Protein"
    },
    {
        "ingredientName": "Walnuts",
        "weight": 30,
        "calories": 185,
        "foodClassification": "Fats"
    },
    {
        "ingredientName": "Cottage Cheese",
        "weight": 120,
        "calories": 120,
        "foodClassification": "Protein"
    },
    {
        "ingredientName": "Lentils",
        "weight": 100,
        "calories": 116,
        "foodClassification": "Carbs"
    },
    {
        "ingredientName": "Turkey Breast",
        "weight": 120,
        "calories": 125,
        "foodClassification": "Protein"
    },
    {
        "ingredientName": "Peanut Butter",
        "weight": 32,
        "calories": 190,
        "foodClassification": "Fats"
    },
    {
        "ingredientName": "Avocado",
        "weight": 100,
        "calories": 160,
        "foodClassification": "Fats"
    },
    {
        "ingredientName": "Shrimp",
        "weight": 80,
        "calories": 84,
        "foodClassification": "Protein"
    }
]

function ap() {
    var color1 = { 'default': '#ffff' }
    const obj1 = new Table('Marklist', data, 1, color1);
    var header = Object.keys(data[0]);
    obj1.filter();
    var color = { 'Protein': '#CD575F', 'Fats': '#f2f24f', 'Carbs': '#7EC77E' };
    var header1 = Object.keys(food[0]);
    const obj2 = new Table('Food', food, 2, color);
    obj2.filter();
    const obj3 = new Table('Foodie', food, 3, color1);
    obj3.sortenable(header1, 'unsort');
}

