/**
 * Callable command
 * @class Command
 */
class Command{
    /**
     * @param {Object} command The object that will be destructed.
     * @param {string} command.name Name of the command
     * @param {string} command.description Short description of the command
     * @param {Function} command.core What the logic of the command is. The part that will return or do something.
     * @param {Function} command.parser Takes in a message and returns a dissected object with what core needs to function.
     */
    constructor({name, description, core, parser}){
        this._name = name;
        this._description = description;
        this._core = core;
        this._parser = parser;
    }

    get name(){
        return this._name;
    }

    get description(){
        return this._description;
    }

    get core(){
        return this._core;
    }

    get parser(){
        return this._parser;
    }

    /**
     * @param {string} description Description of the command
     * @memberof Command
     */
    set description(description){
        this._description = description;
    }

    /**
     * @param {Function} func What is executed when the command is called
     * @memberof Command
     */
    set core(func){
        this._core = func;
    }
    /**
     * @param {string} name Name of the command
     * @memberof Command
     */
    set name(name){
        this._name = name;
    }

    /**
     * @param {Function} parser Dissects an input and returns what core needs
     * @memberof Command
     */
    set parser(parser){
        this._parser = parser;
    }
}

module.exports = Command;
