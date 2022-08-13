const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Rave - Stage 1 tests", function () {
  it(`Should be able to deploy .ftm registry`, async function () {
    const Rave = await ethers.getContractFactory("Rave");
    const rave = await Rave.deploy("ftm", ethers.utils.parseEther('5'),"0x15672d6adee880936e5e30c588abef9d81f46196");
    await rave.deployed();

    console.log(`    ${await rave.symbol()} : ${await rave.name()}`)

    expect(await rave.symbol()).to.equal(".ftm");
  });
  it(`Should be able to deploy .boo registry`, async function () {
    const Rave = await ethers.getContractFactory("Rave");
    const rave = await Rave.deploy("boo", ethers.utils.parseEther('5'), "0x15672d6adee880936e5e30c588abef9d81f46196");
    await rave.deployed();

    console.log(`    ${await rave.symbol()} : ${await rave.name()}`)

    expect(await rave.symbol()).to.equal(".boo");
  });
  it(`Should be able to deploy 0x registry`, async function () {
    const Rave = await ethers.getContractFactory("RavePrefix");
    const rave = await Rave.deploy("0x", ethers.utils.parseEther('5'), "0x15672d6adee880936e5e30c588abef9d81f46196");
    await rave.deployed();

    console.log(`    ${await rave.symbol()} : ${await rave.name()}`)

    expect(await rave.symbol()).to.equal("0x");
  });
});
describe("Rave - Stage 2 tests", function () {
  it(`Should be able to register z.ftm`, async function () {
    const Rave = await ethers.getContractFactory("Rave");
    const rave = await Rave.deploy("ftm", ethers.utils.parseEther('0'),"0x15672d6adee880936e5e30c588abef9d81f46196");
    await rave.deployed();

    await rave.registerName("z");

    console.log(`    ${await rave.getOwner("z.ftm")} : ${await rave.getName("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", 0)}`)

    expect(await rave.getOwner("z.ftm")).to.equal("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
  });
  it(`Should be able to register z.kek`, async function () {
    const Rave = await ethers.getContractFactory("Rave");
    const rave = await Rave.deploy("kek", ethers.utils.parseEther('0'),"0x15672d6adee880936e5e30c588abef9d81f46196");
    await rave.deployed();

    await rave.registerName("z");

    console.log(`    ${await rave.getOwner("z.kek")} : ${await rave.getName("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", 0)}`)

    expect(await rave.getOwner("z.kek")).to.equal("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
  });
  it(`Should be able to register z.ftm and z2.ftm`, async function () {
    const Rave = await ethers.getContractFactory("Rave");
    const rave = await Rave.deploy("ftm", ethers.utils.parseEther('0'),"0x15672d6adee880936e5e30c588abef9d81f46196");
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
    const rave = await Rave.deploy("ftm", ethers.utils.parseEther('0'),"0x15672d6adee880936e5e30c588abef9d81f46196");
    await rave.deployed();

    await rave.registerName("z");

    console.log(`    ${await rave.getOwner("z.ftm")} : ${await rave.getName("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", 0)}`);

    await expect(rave.registerName("z")).to.be.revertedWith("Rave: You cant register a name thats already owned");
  });
});
describe("Rave - Stage 3 tests", function () {
  it(`Should be able to transfer z.ftm`, async function () {
    const Rave = await ethers.getContractFactory("Rave");
    const rave = await Rave.deploy("ftm", ethers.utils.parseEther('0'),"0x15672d6adee880936e5e30c588abef9d81f46196");
    await rave.deployed();

    await rave.registerName("z");

    console.log(`    ${await rave.getOwner("z.ftm")} : ${await rave.getName("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", 0)}`);

    await rave['safeTransferFrom(address,address,string)']("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266","0x3e522051a9b1958aa1e828ac24afba4a551df37d","z.ftm");

    console.log(`    ${await rave.getOwner("z.ftm")} : ${await rave.getName("0x3e522051a9b1958aa1e828ac24afba4a551df37d", 0)}`);

    // this address must be checksummed
    expect(await rave.getOwner("z.ftm")).to.equal("0x3e522051A9B1958Aa1e828AC24Afba4a551DF37d");
  });
});

describe("Rave URI Generator", function () {
  it(`Should be able to make an image for z.ftm`, async function () {
    const RaveURIGenerator = await ethers.getContractFactory("RaveURIGenerator");
    const rave = await RaveURIGenerator.deploy();
    await rave.deployed();

    console.log(await rave.generate('z.ftm'));
  });
  it(`Should be able to make an image for 1234567890.ftm`, async function () {
    const RaveURIGenerator = await ethers.getContractFactory("RaveURIGenerator");
    const rave = await RaveURIGenerator.deploy();
    await rave.deployed();

    console.log(await rave.generate('1234567890.ftm'));
  });
  it(`Estimate gas for migrate`, async function () {
    const [owner, i, ii, iii, iv, v, vi, vii, viii, ix, x] = await ethers.getSigners();
    const Rave = await ethers.getContractFactory("Rave");
    const RaveV1 = await ethers.getContractFactory("FantomsArtNameSystem");
    const rave = await Rave.deploy("ftm", ethers.utils.parseEther('0'),"0x15672d6adee880936e5e30c588abef9d81f46196");
    const rave1 = await RaveV1.deploy();
    await rave.deployed();
    await rave1.deployed();

    await rave1.changeFee(ethers.utils.parseEther('0'));

    console.log(await rave.estimateGas.migrate(rave1.address, 0, 0));

    await rave1.connect(i).registerName("1.ftm");
    await rave1.connect(ii).registerName("2.ftm");
    await rave1.connect(iii).registerName("3.ftm");
    await rave1.connect(iv).registerName("4.ftm");
    await rave1.connect(v).registerName("5.ftm");
    await rave1.connect(vi).registerName("6.ftm");
    await rave1.connect(vii).registerName("7.ftm");
    await rave1.connect(viii).registerName("8.ftm");
    await rave1.connect(ix).registerName("9.ftm");
    await rave1.connect(x).registerName("10.ftm");

    console.log(await rave.estimateGas.migrate(rave1.address, 0, 9));
  });
});
