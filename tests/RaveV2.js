const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Rave - Stage 1 tests", function () {
  it(`Should be able to deploy .ftm registry`, async function () {
    const Rave = await ethers.getContractFactory("Rave");
    const rave = await Rave.deploy("ftm", ethers.utils.parseEther('5'));
    await rave.deployed();

    console.log(`    ${await rave.symbol()} : ${await rave.name()}`)

    expect(await rave.symbol()).to.equal(".ftm");
  });
  it(`Should be able to deploy .boo registry`, async function () {
    const Rave = await ethers.getContractFactory("Rave");
    const rave = await Rave.deploy("boo", ethers.utils.parseEther('5'));
    await rave.deployed();

    console.log(`    ${await rave.symbol()} : ${await rave.name()}`)

    expect(await rave.symbol()).to.equal(".boo");
  });
  it(`Should be able to deploy 0x registry`, async function () {
    const Rave = await ethers.getContractFactory("RavePrefix");
    const rave = await Rave.deploy("0x", ethers.utils.parseEther('5'));
    await rave.deployed();

    console.log(`    ${await rave.symbol()} : ${await rave.name()}`)

    expect(await rave.symbol()).to.equal("0x");
  });
});
describe("Rave - Stage 2 tests", function () {
  it(`Should be able to register z.ftm`, async function () {
    const Rave = await ethers.getContractFactory("Rave");
    const rave = await Rave.deploy("ftm", ethers.utils.parseEther('0'));
    await rave.deployed();

    await rave.registerName("z");

    console.log(`    ${await rave.getOwner("z.ftm")} : ${await rave.getName("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", 0)}`)

    expect(await rave.getOwner("z.ftm")).to.equal("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
  });
  it(`Should be able to register z.kek`, async function () {
    const Rave = await ethers.getContractFactory("Rave");
    const rave = await Rave.deploy("kek", ethers.utils.parseEther('0'));
    await rave.deployed();

    await rave.registerName("z");

    console.log(`    ${await rave.getOwner("z.kek")} : ${await rave.getName("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", 0)}`)

    expect(await rave.getOwner("z.kek")).to.equal("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
  });
  it(`Should be able to register z.ftm and z2.ftm`, async function () {
    const Rave = await ethers.getContractFactory("Rave");
    const rave = await Rave.deploy("ftm", ethers.utils.parseEther('0'));
    await rave.deployed();

    await rave.registerName("z");

    console.log(`    ${await rave.getOwner("z.ftm")} : ${await rave.getName("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", 0)}`);


    await rave.registerName("z2");

    console.log(`    ${await rave.getOwner("z2.ftm")} : ${await rave.getName("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", 1)}`);

    expect(await rave.getOwner("z.ftm")).to.equal("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
    expect(await rave.getOwner("z2.ftm")).to.equal("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
  });
  it(`Should not able to register z.ftm twice`, async function () {
    const Rave = await ethers.getContractFactory("Rave");
    const rave = await Rave.deploy("ftm", ethers.utils.parseEther('0'));
    await rave.deployed();

    await rave.registerName("z");

    console.log(`    ${await rave.getOwner("z.ftm")} : ${await rave.getName("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", 0)}`);

    await expect(rave.registerName("z")).to.be.revertedWith("Rave: You cant register a name thats already owned");
  });
});
describe("Rave - Stage 3 tests", function () {
  it(`Should be able to transfer z.ftm`, async function () {
    const Rave = await ethers.getContractFactory("Rave");
    const rave = await Rave.deploy("ftm", ethers.utils.parseEther('0'));
    await rave.deployed();

    await rave.registerName("z");

    console.log(`    ${await rave.getOwner("z.ftm")} : ${await rave.getName("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", 0)}`);

    await rave['safeTransferFrom(address,address,string)']("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266","0x3e522051a9b1958aa1e828ac24afba4a551df37d","z.ftm");

    console.log(`    ${await rave.getOwner("z.ftm")} : ${await rave.getName("0x3e522051a9b1958aa1e828ac24afba4a551df37d", 0)}`);

    // this address must be checksummed
    expect(await rave.getOwner("z.ftm")).to.equal("0x3e522051A9B1958Aa1e828AC24Afba4a551DF37d");
  });
});
