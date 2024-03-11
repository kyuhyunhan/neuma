import { observable } from "./observer.js";

export class Store {
  #state;
  #mutations;
  #actions; // private으로 지정하여 외부에서는 접근이 안 되도록 한다.
  state = {};

  constructor({ state, mutations, actions }: any) {
    this.#state = observable(state);
    this.#mutations = mutations;
    this.#actions = actions;

    // state를 직접적으로 수정하지 못하도록 다음과 같이 정의한다.
    Object.keys(state).forEach((key) => {
      Object.defineProperty(this.state, key, { get: () => this.#state[key] });
    });
  }

  commit(action: any, payload: any) {
    // state는 오직 commit을 통해서 수정 할 수 있다.
    this.#mutations[action](this.#state, payload);
  }

  dispatch(action: any, payload: any): any {
    /**
     * 예제에서 dispatch는 사용되고 있진 않진 않지만 아마 vuex를 써본 사람이라면 익숙할 것이다.
     * @see {https://vuex.vuejs.org/kr/api/#actions}
     */
    return this.#actions[action](
      {
        state: this.#state,
        commit: this.commit.bind(this),
        dispatch: this.dispatch.bind(this),
      },
      payload
    );
  }
}
