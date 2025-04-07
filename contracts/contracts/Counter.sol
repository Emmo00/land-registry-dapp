// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Counter {
    uint256 private _count;

    constructor() {
        _count = 0;
    }

    function increment() public {
        _count += 1;
    }

    function decrement() public {
        require(_count > 0, "Counter: decrement overflow");
        _count -= 1;
    }

    function current() public view returns (uint256) {
        return _count;
    }
}
