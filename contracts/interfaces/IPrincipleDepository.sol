// SPDX-License-Identifier: MIT

pragma solidity 0.7.5;

interface IPrincipleDepository {
  function getCurrentBondTerm() external returns ( uint, uint );
  function treasury() external returns ( address );
  function getBondCalculator() external returns ( address );
  function isPrincipleToken( address ) external returns ( bool );
  function getDepositorInfoForDepositor( address ) external returns ( uint, uint, uint );
  function addPrincipleToken( address newPrincipleToken_ ) external returns ( bool );
  function setTreasury( address newTreasury_ ) external returns ( bool );
  function addBondTerm( address bondPrincipleToken_, uint256 bondScalingFactor_, uint256 bondingPeriodInBlocks_ ) external returns ( bool );
  function getDepositorInfo( address depositorAddress_) external view returns ( uint principleAmount_, uint interestDue_, uint bondMaturationBlock_);
  function depositBondPrinciple( address bondPrincipleTokenToDeposit_, uint256 amountToDeposit_ ) external returns ( bool );
  function depositBondPrincipleWithPermit( address bondPrincipleTokenToDeposit_, uint256 amountToDeposit_, uint256 deadline, uint8 v, bytes32 r, bytes32 s ) external returns ( bool );
  function withdrawPrincipleAndForfeitInterest( address bondPrincipleToWithdraw_ ) external returns ( bool );
  function redeemBond(address bondPrincipleToRedeem_ ) external returns ( bool );
}
