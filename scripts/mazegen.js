
const up = -1;
const down = 1; 
const left = -10;
const right  = 10;

const directions = {
    [up]: {vector: [0, -1], cssClass: 'borderTop'}, 
    [down]: {vector: [0, 1], cssClass: 'borderBottom'}, 
    [left]: {vector: [-1, 0], cssClass: 'borderLeft'}, 
    [right]: {vector: [1, 0], cssClass: 'borderRight'}
}

const directionKeys = Object.keys(directions).map(e => parseInt(e, 10));

export class Maze {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.grid = Array(height).fill(null)
            .map((r, y) => Array(width).fill(null)
                .map((c, x) => new Node(x, y)));
    }

    generate() {
        this.walk(0, 0)
    }

    walk(x, y) {
        let node = this.grid[y][x];
        let keys = shuffle(directionKeys)
        for (let i=0; i<keys.length; i++) {
                let dir = keys[i];
                let vector = directions[dir].vector;
                let [nextx, nexty] = [x + vector[0], y + vector[1]];
                if (nextx < 0 || nextx >= this.width || nexty < 0 || nexty >= this.height) {
                    node.borders[dir] = true;
                    continue;
                }

                let nextNode = this.grid[nexty][nextx];
                if (!nextNode.isEmpty()) {
                    let opposite = parseInt(dir, 10) * -1;
                    node.borders[dir] = !(nextNode.borders[opposite] === false);
                    continue;
                }

                node.borders[dir] = false;
                this.walk(nextx, nexty);
            };
    }

    drawTable(elm) {
        let table = document.createElement('table');
        for (let i = 0; i < this.height; i++) {
            let tr = document.createElement('tr');
            table.appendChild(tr);
            for (let j = 0; j < this.width; j++) {
                let td = document.createElement('td');
                td.appendChild(document.createTextNode(" "));
                tr.appendChild(td);

                let node = this.grid[i][j];
                for (let dir in directions){
                    if (node.borders[dir]) td.classList.add(directions[dir].cssClass);
                }
            }
        }
        elm.innerHTML = "";
        elm.appendChild(table);
    }
}

class Node {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.borders = {}
        directionKeys.forEach(e => this.borders[e] = null);
    }

    isEmpty() {
        return directionKeys.every(dir => {
            return this.borders[dir] === null;
        })
    }
}

function shuffle(arr) {
    var narr = arr.slice();
    for (let i = 0, len = narr.length; i < len; i++) {
        let j = Math.floor(Math.random() * len);
        [narr[i], narr[j]] = [narr[j], narr[i]];
    }
    return narr
}