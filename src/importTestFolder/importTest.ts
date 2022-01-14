/* The only purpose of this file is to serve as import test for jest configs. 
It should be discarded once you know that everything is working fine */

interface IData {
  passPhrase: string;
}

const testObject: IData = {
  passPhrase: "I Let it In and It Took Everything",
};

export { testObject };
