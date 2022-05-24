// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/interfaces/IERC20.sol";

contract BatchTransfer {
    function batchTansferETH(address[] memory reciepts, uint256 _value)
        public
        payable
    {
        uint256 remainValue = msg.value;
        for (uint8 i = 0; i < reciepts.length; i++) {
            remainValue -= _value;
            transferETHViaCall(reciepts[i], _value);
        }
    }

    function transferETHViaCall(address _to, uint256 _value) public {
        (bool isSent, bytes memory data) = payable(_to).call{value: _value}("");
        require(isSent, "send eth failed");
    }

    function transferERC20(
        address _from,
        address _to,
        address _token,
        uint256 _value
    ) public {
        IERC20 erc20Token = IERC20(_token);
        erc20Token.transferFrom(_from, _to, _value);
    }

    function batchTransferERC20(
        address[] memory _reciepts,
        address _tokenAddress,
        uint256 _value
    ) public {
        for (uint8 i = 0; i < _reciepts.length; i++) {
            transferERC20(msg.sender, _reciepts[i], _tokenAddress, _value);
        }
    }
}
