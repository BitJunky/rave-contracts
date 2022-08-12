// SPDX-License-Identifier: Unlisence
pragma solidity >=0.8.12;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Rave is ERC721, ERC721Enumerable {
  using Counters for Counters.Counter;

  uint public price;
  string public extension;
  Counters.Counter private _tokenIdCounter;
  address public treasury = 0x87f385d152944689f92Ed523e9e5E9Bd58Ea62ef;

  mapping(bytes32 => bool) regsitered;
  mapping(uint256 => RaveName) tokenIdName;
  mapping(bytes32 => uint256) nameToTokenId;

  struct RaveName {
    string name;
    uint tokenId;
    string addresses;
    string avatar;
  }

  constructor(
    string memory _extension,
    uint _price
  ) ERC721(string.concat(string.concat("Rave Names .", _extension), " registry"), string.concat(".", _extension)) {
    price = _price;
    extension = _extension;
  }

  function _makeHash(
    string memory input
  ) internal pure returns(bytes32) {
    return keccak256(abi.encode(input));
  }

  function __lower(
    bytes1 _b1
  ) private pure returns (bytes1) {
      if (_b1 >= 0x41 && _b1 <= 0x5A) {
          return bytes1(uint8(_b1) + 32);
      }

      return _b1;
  }

  function _lower(
    string memory _base
  ) internal pure returns (string memory) {
      bytes memory _baseBytes = bytes(_base);
      for (uint i = 0; i < _baseBytes.length; i++) {
          _baseBytes[i] = __lower(_baseBytes[i]);
      }
      return string(_baseBytes);
  }

  function registerName(
    string memory _name
  ) public payable {
    require(msg.value >= price, "Rave: You must pay the full price.");
    payable(treasury).transfer(msg.value);
    string memory name = _lower(string.concat(
      string.concat(_name, "."),
      extension
    ));
    bytes32 _hashedName = _makeHash(name);
    require(!(regsitered[_hashedName]), "Rave: You cant register a name thats already owned.");
    RaveName memory constructedName = RaveName(
      name,
      _tokenIdCounter.current(),
      "",
      ""
    );
    regsitered[_hashedName] = true;
    tokenIdName[_tokenIdCounter.current()] = constructedName;
    nameToTokenId[_hashedName] = _tokenIdCounter.current();
    _safeMint(msg.sender, _tokenIdCounter.current());
    _tokenIdCounter.increment();
  }

  function bulkRegister(
    string[] memory names
  ) external payable {
    for (uint i = 0; i < names.length;) {
      registerName(names[i]);
      unchecked { i++; }
    }
  }

  function registerNameAndSend(
    string memory _name,
    address sendTo
  ) public payable {
    require(msg.value >= price, "Rave: You must pay the full price.");
    payable(treasury).transfer(msg.value);
    string memory name = _lower(string.concat(
      string.concat(_name, "."),
      extension
    ));
    bytes32 _hashedName = _makeHash(name);
    require(!(regsitered[_hashedName]), "Rave: You cant register a name thats already owned.");
    RaveName memory constructedName = RaveName(
      name,
      _tokenIdCounter.current(),
      "",
      ""
    );
    regsitered[_hashedName] = true;
    tokenIdName[_tokenIdCounter.current()] = constructedName;
    nameToTokenId[_hashedName] = _tokenIdCounter.current();
    _safeMint(sendTo, _tokenIdCounter.current());
    _tokenIdCounter.increment();
  }

  function bulkRegisterAndSend(
    string[] memory names,
    address[] memory addresses
  ) external payable {
    require(names.length == addresses.length, "Rave: The amount of addresses must be equal to the amount of names.");
    for (uint i = 0; i < names.length;) {
      registerNameAndSend(names[i], addresses[i]);
      unchecked { i++; }
    }
  }

  function setAddresses(
    string memory _name,
    string memory addresses
  ) external {
    string memory name = _lower(_name);
    bytes32 _hashedName = _makeHash(name);
    require(ownerOf(nameToTokenId[_hashedName]) == msg.sender, "Rave: You must own the name to set the addresses.");
    tokenIdName[nameToTokenId[_hashedName]].addresses = addresses;
  }

  function setAvatar(
    string memory _name,
    string memory avatar
  ) external {
    string memory name = _lower(_name);
    bytes32 _hashedName = _makeHash(name);
    require(ownerOf(nameToTokenId[_hashedName]) == msg.sender, "Rave: You must own the name to set the avatar.");
    tokenIdName[nameToTokenId[_hashedName]].avatar = avatar;
  }

  function getAddresses(
    string memory name
  ) external view returns(string memory) {
    return tokenIdName[nameToTokenId[_makeHash(_lower(name))]].addresses;
  }

  function getAvatar(
    string memory name
  ) external view returns(string memory) {
    return tokenIdName[nameToTokenId[_makeHash(_lower(name))]].avatar;
  }

  function getOwner(
    string memory name
  ) external view returns(address) {
    return ownerOf(nameToTokenId[_makeHash(_lower(name))]);
  }

  function getName(
    address owner,
    uint index
  ) external view returns(string memory) {
    return tokenIdName[tokenOfOwnerByIndex(owner, index)].name;
  }

  function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721Enumerable) returns (bool) {
    return super.supportsInterface(interfaceId);
  }

  function safeTransferFrom(
    address from,
    address to,
    string memory name
  ) external {
    safeTransferFrom(from, to, nameToTokenId[_makeHash(name)]);
  }

  function transferFrom(
    address from,
    address to,
    string memory name
  ) external {
    transferFrom(from, to, nameToTokenId[_makeHash(name)]);
  }

  function _beforeTokenTransfer(
      address from,
      address to,
      uint256 tokenId
  ) internal virtual override(ERC721, ERC721Enumerable) {
    super._beforeTokenTransfer(
      from,
      to,
      tokenId
    );
  }
}
