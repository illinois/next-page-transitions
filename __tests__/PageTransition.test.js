/* eslint-disable no-undef */
import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { configure, shallow } from "enzyme";
import PageTransition from "src/PageTransition";

configure({ adapter: new Adapter()});

const requiredProps = {
  timeout: 300,
  classNames: "page-transition",
  children: <p>Hello</p>
}

describe("Page Transition", ()=>{
  it("works", () =>{
    const component = shallow(<PageTransition {...requiredProps} />);
    component.unmount();
  });
});
