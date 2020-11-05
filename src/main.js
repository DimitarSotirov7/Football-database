(function solve() {
    const url = 'https://football-teams-3e351.firebaseio.com/';

    const elements = {
        loaded: {
            table: document.querySelector('.loaded-data'),
            body: document.querySelector('.loaded-data tbody'),
            singleInput: document.querySelector('.loaded-data input'),
            singleBtn: document.querySelector('#loadSingleBtn'),
            allBtn: document.querySelector('#loadAllBtn'),
        },
        create: {
            team: document.querySelector('.create-data .team'),
            player: document.querySelector('.create-data .player'),
            kit: document.querySelector('.create-data .kit'),
            goals: document.querySelector('.create-data .goals'),
            btn: document.querySelector('.create-data #createBtn'),
            invalidParams: document.querySelector('.create-data .invalidParams'),
        },
        modify: {
            data: document.querySelector('.modify-data'),
            team: document.querySelector('.modify-data .team'),
            player: document.querySelector('.modify-data .player'),
            kit: document.querySelector('.modify-data .kit'),
            goals: document.querySelector('.modify-data .goals'),
            btn: document.querySelector('.modify-data #update'),
            invalidParams: document.querySelector('.modify-data .invalidParams'),
        }
    }

    elements.loaded.singleBtn.addEventListener('click', loadSingle);
    elements.loaded.allBtn.addEventListener('click', loadAll);
    elements.create.btn.addEventListener('click', createRecord);
    elements.loaded.body.addEventListener('click', modifyRecord);

    function modifyRecord(e) {
        if (e.target.nodeName !== 'BUTTON') {
            return;
        }
        
        let btnClicked = e.target;
        let delRecord = [...e.currentTarget
            .querySelectorAll('tr')]
            .find(r => r.querySelector('.deleteBtn') === btnClicked);
        let updRecord = [...e.currentTarget
            .querySelectorAll('tr')]
            .find(r => r.querySelector('.updateBtn') === btnClicked);

        let playerToModify = {};
        let teamToModify = {};

        if (delRecord) {

            if (!confirm('Are you sure you want to delete this record?')) {
                return;
            }
            
            playerToModify = delRecord.querySelector('.player').textContent;

            fetch(url + '.json')
                .then(r => r.json())
                .then(data => {
                    let key = Object.keys(data).find(key => data[key].player === playerToModify);
                    fetch(url + `${key}/.json`, { method: 'DELETE' })
                        .catch(e => console.log(e));
                })
                .catch(e => console.log(e));

            delRecord.remove();

        } else if (updRecord) {
            playerToModify = updRecord.querySelector('.player').textContent;
            teamToModify = updRecord.querySelector('.team').textContent;

            elements.modify.data.style.display = 'block';

            elements.modify.btn.addEventListener('click', updateRecord);
        }

        function updateRecord() {
            let team = elements.modify.team.value;
            let player = elements.modify.player.value;
            let kit = elements.modify.kit.value;
            let goals = elements.modify.goals.value;

            let correctKit = Number(kit) || kit === '' || Number(kit) > 0 ? true : false;
            let correctGoals = Number(goals) || goals === '0' || goals === '' || Number(goals) > 0 ? true : false;
            if (!correctKit || !correctGoals) {
                let message = 'Invalid parameters!';
                elements.modify.invalidParams.textContent = message;
                return;
            }

            elements.modify.invalidParams.style.display = 'none';

            fetch(url + '.json')
                .then(r => r.json())
                .then(data => {

                    let key = Object.keys(data)
                        .find(key => data[key].player === playerToModify &&
                            data[key].team === teamToModify);

                    let newData = {
                        team: team ? team : data[key].team,
                        player: player ? player : data[key].player,
                        kit: kit ? kit : data[key].kit,
                        goals: goals ? goals : data[key].goals,
                    };

                    fetch(url + `${key}/.json`, {
                        method: 'PUT',
                        body: JSON.stringify(newData)
                    }).catch(e => console.log(e));
                })
                .catch(e => console.log(e));

            elements.modify.team.value = '';
            elements.modify.player.value = '';
            elements.modify.kit.value = '';
            elements.modify.goals.value = '';
            elements.modify.data.style.display = 'none';

            elements.loaded.allBtn.textContent = 'Refresh';
            elements.modify.btn.removeEventListener('click', updateRecord);
        }
    }

    function loadSingle() {
        let playerName = elements.loaded.singleInput.value;
        if (!playerName) {
            return
        }

        elements.loaded.body.innerHTML = '';

        fetch(url + '.json')
            .then(r => r.json())
            .then(data => {
                let record = Object.values(data).find(x => x.player === playerName);
                let row = createTableRow(record.team, record.player, record.kit, record.goals);
                elements.loaded.body.appendChild(row);
            })
            .catch(e => {
                let invalid = document.createElement('tr');
                invalid.textContent = 'Player is missing';
                invalid.style.color = 'red';
                elements.loaded.body.appendChild(invalid);
            });

        elements.loaded.singleInput.value = '';
    }

    function loadAll() {
        elements.loaded.body.innerHTML = '';

        fetch(url + '.json')
            .then(r => r.json())
            .then(data => {
                Object.keys(data).map(key => {
                    let team = data[key].team;
                    let player = data[key].player;
                    let kit = data[key].kit;
                    let goals = data[key].goals;

                    let row = createTableRow(team, player, kit, goals);
                    elements.loaded.body.appendChild(row);
                });
            })
            .catch(e => console.log(e));

        elements.loaded.allBtn.textContent = 'Load All';
    }

    function createRecord() {
        const team = elements.create.team.value;
        const player = elements.create.player.value;
        const kit = elements.create.kit.value;
        const goals = elements.create.goals.value;

        if (!team || !player || !Number(kit) || (!Number(goals) && goals !== '0') || Number(kit) <= 0 || Number(goals) < 0) {
            let message = 'Invalid parameters!';
            elements.create.invalidParams.textContent = message;
            return;
        }

        elements.create.invalidParams.style.display = 'none';

        fetch(url + '.json')
            .then(r => r.json())
            .then(data => {
                let existingPlayer = Object.keys(data).find(key => data[key].player === player);
                if (!existingPlayer) {
                    fetch(url + '.json', {
                        method: 'POST',
                        body: JSON.stringify({
                            team,
                            player,
                            kit,
                            goals
                        })
                    }).catch(e => console.log(e));

                    if (elements.loaded.body.innerHTML !== '') {
                        elements.loaded.allBtn.textContent = 'Refresh';
                    }
                }
            })
            .catch(e => console.log(e));

        elements.create.team.value = '';
        elements.create.player.value = '';
        elements.create.kit.value = '';
        elements.create.goals.value = '';
    }

    function createTableRow(team, player, kit, goals) {
        let row = document.createElement('tr');
        let teamBody = document.createElement('td');
        teamBody.textContent = team;
        teamBody.setAttribute('class', 'team');
        let playerBody = document.createElement('td');
        playerBody.textContent = player;
        playerBody.setAttribute('class', 'player');
        let kitBody = document.createElement('td');
        kitBody.textContent = kit;
        kitBody.setAttribute('class', 'kit');
        let goalsBody = document.createElement('td');
        goalsBody.textContent = goals;
        goalsBody.setAttribute('class', 'goals');
        let deleteCell = document.createElement('td');
        let deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'DEL';
        deleteBtn.setAttribute('class', 'deleteBtn');
        deleteCell.appendChild(deleteBtn);
        let updateCell = document.createElement('td');
        let updateBtn = document.createElement('button');
        updateBtn.textContent = 'CHANGE';
        updateBtn.setAttribute('class', 'updateBtn');
        updateCell.appendChild(updateBtn);
        row.appendChild(teamBody);
        row.appendChild(playerBody);
        row.appendChild(kitBody);
        row.appendChild(goalsBody);
        row.appendChild(deleteCell);
        row.appendChild(updateCell);
        return row;
    }
})();