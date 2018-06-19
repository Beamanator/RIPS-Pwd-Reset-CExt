import React from 'react';

import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import NavigationItems from './NavigationItems';
import NavigationItem from './NavigationItem/NavigationItem';

// connect and setup enzyme
configure({
    adapter: new Adapter()
});

describe('<NavigationItems />', () => {
    let wrapper;

    // gets executed before each test
    beforeEach(() => {
        wrapper = shallow(<NavigationItems />);
    });

    it('should render two <NavigationItem /> elements if not authenticated', () => {
        expect(wrapper.find(NavigationItem)).toHaveLength(2);
    });

    it ('should render three <NavigationItem /> elements if authenticated', () => {
        // method 1:
        // wrapper = shallow(<NavigationItems isAuthenticated />);
        
        // method 2:
        wrapper.setProps({isAuthenticated: true});
        
        expect(wrapper.find(NavigationItem)).toHaveLength(3);
    });

    it ('should render Logout <NavigationItem /> if authenticated', () => {
        wrapper.setProps({isAuthenticated: true});
        expect(wrapper.contains(<NavigationItem link="/logout">Logout</NavigationItem>)).toEqual(true);
    })
});