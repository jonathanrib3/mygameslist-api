function whatever(whatever) {
  return whatever;
}

it("sim", () => {
  const mock = (<jest.Mock>whatever).mockReturnValue("KAPPAKAPPA");

  
});
