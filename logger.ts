import debug from "debug";

export default class Logger {

  private debug: debug.Debugger;

  constructor(namespace: string) {
    this.debug = debug(`chevtek:${namespace}`);
    this.log = this.log.bind(this);
  }

  public log(line: string) {
    this.debug(line);
  }
}
