
pragma solidity 0.7.5;

import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


interface IVault {
    function depositReserves(uint256 amount) external returns (bool);
}

interface IPLYS {
    function burnFrom(address account, uint256 amount) external;
}

contract ExercisePLYS is Ownable {
    using SafeERC20 for IERC20;

    // in hundreths i.e. 50 = 0.5%
    mapping(address => uint256) public percentCanVest;
    mapping(address => uint256) public amountClaimed;
    mapping(address => uint256) public maxAllowedToClaim;

    address public pLYS;
    address public LYS;
    address public DAI;

    address public treasury;

    constructor(address pLYS_, address lys_, address dai_, address treasury_) {
        pLYS = pLYS_;
        LYS = lys_;
        DAI = dai_;
        treasury = treasury_;
    }

    function setTerms(address vester, uint256 amountCanClaim, uint256 rate) external onlyOwner returns (bool) {
        require(amountCanClaim >= maxAllowedToClaim[vester], "cannot lower amount claimable");
        require(rate >= percentCanVest[vester], "cannot lower vesting rate");

        maxAllowedToClaim[vester] = amountCanClaim;
        percentCanVest[vester] = rate;

        return true;
    }

    function exercisePLYS(uint256 amountToExercise) external returns (bool) {
        require(getPLYSAbleToClaim(_msgSender()) >= amountToExercise, 'Not enough LYS vested');
        require(maxAllowedToClaim[_msgSender()] >= amountClaimed[_msgSender()] + amountToExercise, 'Claimed over max');

        IERC20(DAI).safeTransferFrom(_msgSender(), address(this), amountToExercise);
        IERC20(DAI).approve(treasury, amountToExercise);

        IVault(treasury).depositReserves(amountToExercise);
        IPLYS(pLYS).burnFrom(_msgSender(), amountToExercise);

        amountClaimed[_msgSender()] += amountToExercise;

        uint256 amountLYSToSend = amountToExercise / 1e9;

        IERC20(LYS).safeTransfer(_msgSender(), amountLYSToSend);

        return true;
    }

    function getPLYSAbleToClaim(address vester) public view returns (uint256) {
        return IERC20(LYS).totalSupply() * percentCanVest[vester] * 1e9 / 10000 - amountClaimed[vester];
    }
}