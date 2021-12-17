/**
 *Submitted for verification at BscScan.com on 2021-11-21
*/

// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.2;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";

contract ChefToken {
    using SafeMath for uint;
    
    //Tax Addresses
    address target_1 = 0xeB46756a26F58837Df192F378859AAbf4cE20639;
    address target_2= 0x5932e31bc7231d61d939e63d02E17627ce77112c;
    
    //Events 
    event Transfer(address indexed from, address indexed to, uint amount);
    event Approval(address indexed owner, address indexed spender, uint256 amount);
    
    //Variables
    string public name = "CHEFORAMA";
    string public symbol = "CHEF";
    uint public decimals = 18;
    uint public totalSupply = 5000000000*10**18;
    uint public limit = 150000000*10**18;
    address owner;
    mapping(address => mapping(address => uint256)) public allowed;
    mapping (address => uint) public balances;
    
    
    constructor (address founder) {
	owner = founder;
    balances[msg.sender] = totalSupply * 6 /100;
	balances[founder] = totalSupply *94 /100;
    }

    function balanceOf(address _owner) public view returns(uint){
        return balances[_owner];
    }
    
    function ChangeOwner (address _newOwner) OnlyOwner public {
	owner = _newOwner;
    }
    
    function ShowOwner () public view returns(address) {
        return owner;
    }

    modifier OnlyOwner () {
	require(msg.sender == owner, "You can not call this function");
	_;
    }
    
   function ChangeTarget (uint _target, address _newTarget) OnlyOwner public {
	if (_target == 1){target_1  = _newTarget;}
	if (_target == 2){target_2 = _newTarget;}
   }

    function transfer(address _to, uint256 _amount) public returns (bool success) {
        require(balanceOf[msg.sender] >= _amount);
        _transfer(msg.sender, _to, _amount);
        return true;
    }

    function approve(address _spender, uint256 _amount) public returns (bool success) {
        require(_spender != address(0));
        allowed[msg.sender][_spender] = _amount;
        emit Approval(msg.sender, _spender, _amount);
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _amount) public returns (bool success) {
        require(_amount <= balanceOf[_from]);
        require(_amount <= allowed[_from][msg.sender]);
        allowed[_from][msg.sender] = allowed[_from][msg.sender].sub(_amount);
        _transfer(_from, _to, _amount);
        return true;
    }

    function allowance(address _owner, address _spender) public view returns (uint256 remaining) {
        return allowed[_owner][_spender];
    }
    
    function _transfer(adress _from, address _to, uint _amount) public returns(bool) {
        require(_to != address(0)); 
        require(balanceOf(msg.sender) > _amount,'balance too low');
        require(_amount <= limit, 'exceeds transfer limit');
        uint ShareX = _amount/25;
        uint ShareY = _amount/50;

        balances[_from] = balances[_from].sub(_amount);
        balances[_to] =_balances[_to].add(amount - ShareX -ShareY) ; 
        balances[target_1] = balances[target_1].add(ShareX);
        balances[target_2] = balances[target_2].add(ShareY);

        emit Transfer(_from,_to,_amount);   
    }
}