(() => {
    window.exp = window.exp || {};

    const data = window.exp.data;

    const random = new Random();
    const tools = new Tools();
    const dom = new Dom();
    const state = new State();
    const wordStat = new WordStat(random, tools);
    const controller = new Controller(wordStat, state, data);
    const ui = new Ui(state, dom, controller, data, document.body);
    const app = new App(state, ui, controller);

    const run = async (props) => app.run(props);

    tools.exportOn(window, {
        data, random, 
        tools, dom, 
        state, ui, 
        wordStat, app, 
        Random, Tools, Dom, Ui, State, Ui, WordStat, App,
        run,
    });

    app.start();
    console.log("run({n:4, count:10, max:21, min:6, data_name: 'comm'})");
    console.log("run({n:4, count:10, max:18, min:5, data_name: 'fr'})");
})()