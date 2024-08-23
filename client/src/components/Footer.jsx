import { Button, Footer } from "flowbite-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { FaInstagram } from "react-icons/fa6";
import { FaFacebook } from "react-icons/fa6";
import { FaXTwitter } from "react-icons/fa6";

const FooterCom = () => {
  const [showFooter, setShowFooter] = useState(false);

  return (
    <>
      {showFooter ? (
        <Footer container className=" border border-t-2 p-3 border-t-teal-500">
          <div className=" w-full max-w-7xl mx-auto">
            <div className=" grid w-full justify-between sm:flex md:grid-cols-1">
              <div className="">
                <Link
                  to={"/"}
                  className=" font-semibold dark:text-white flex items-center text-lg"
                >
                  <Button outline gradientDuoTone={"purpleToBlue"} pill>
                    <p className=" text-sm sm:text-xl">{"O'"}</p>
                  </Button>
                  system
                </Link>
              </div>
              <div className=" grid grid-cols-2 gap-8 my-4 mr-4 sm:grid-cols-3 sm:gap-6">
                <div>
                  <Footer.Title title="About" />
                  <Footer.LinkGroup col>
                    <Footer.Link href="/about">
                      What is {"O'SYSTEM"}
                    </Footer.Link>
                  </Footer.LinkGroup>
                </div>
                <div>
                  <Footer.Title title="Follow us" />
                  <Footer.LinkGroup>
                    <Footer.Link
                      href="https://www.instagram.com/mr_intellisense/"
                      className=" text-orange-600"
                    >
                      {<FaInstagram />}
                    </Footer.Link>
                    <Footer.Link
                      href="https://www.facebook.com/dominion.ikedinichi"
                      className=" text-blue-600"
                    >
                      {<FaFacebook />}
                    </Footer.Link>
                    <Footer.Link
                      href="https://x.com/Mr_IntelliSense"
                      className=" text-black"
                    >
                      {<FaXTwitter />}
                    </Footer.Link>
                  </Footer.LinkGroup>
                </div>
                <div>
                  <Footer.Title title="Legal" />
                  <Footer.LinkGroup>
                    <Footer.Link>Terms and Conditions</Footer.Link>
                  </Footer.LinkGroup>
                </div>
              </div>
            </div>
            <Footer.Divider />
            <div className="">
              <Footer.Copyright
                href="#"
                by="Dev King Studios"
                year={new Date().getFullYear()}
              />
            </div>
          </div>
          <Button
            onClick={() => setShowFooter(false)}
            gradientDuoTone={"purpleToBlue"}
            pill
            outline
          >
            {">>>"}
          </Button>
        </Footer>
      ) : (
        <div className=" sticky bottom-2 right-2 w-full flex justify-end">
          <Button
            onClick={() => setShowFooter(true)}
            className=" "
            gradientDuoTone={"purpleToBlue"}
            pill
            outline
          >
            {"<>"}
          </Button>
        </div>
      )}
    </>
  );
};

export default FooterCom;
