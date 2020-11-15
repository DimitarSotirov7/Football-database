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

export default elements;