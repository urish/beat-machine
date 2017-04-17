import { BeatMachinePage } from './app.po';

describe('beat-machine App', () => {
  let page: BeatMachinePage;

  beforeEach(() => {
    page = new BeatMachinePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
