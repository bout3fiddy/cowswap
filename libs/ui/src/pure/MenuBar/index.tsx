import React, { useState, useRef, RefObject } from 'react'

import IMG_ICON_ARROW_RIGHT from '@cowprotocol/assets/images/arrow-right.svg'
import IMG_ICON_CARRET_DOWN from '@cowprotocol/assets/images/carret-down.svg'
import IMG_ICON_MENU_DOTS from '@cowprotocol/assets/images/menu-grid-dots.svg'
import IMG_ICON_MENU_HAMBURGER from '@cowprotocol/assets/images/menu-hamburger.svg'
import IMG_ICON_SETTINGS_GLOBAL from '@cowprotocol/assets/images/settings-global.svg'
import IMG_ICON_X from '@cowprotocol/assets/images/x.svg'
import { useOnClickOutside, useMediaQuery } from '@cowprotocol/common-hooks'
import { addBodyClass, removeBodyClass } from '@cowprotocol/common-utils'
import { CowSwapTheme } from '@cowprotocol/widget-lib'

import SVG from 'react-inlinesvg'
import { ThemeProvider } from 'styled-components/macro'

import {
  RootNavItem,
  MenuBarWrapper,
  MenuBarInner,
  NavDaoTriggerElement,
  DropdownMenu,
  DropdownContent,
  DropdownContentItemButton,
  DropdownContentItemImage,
  DropdownContentItemIcon,
  DropdownContentItemText,
  DropdownContentItemTitle,
  DropdownContentItemDescription,
  GlobalSettingsWrapper,
  GlobalSettingsButton,
  NavItems,
  StyledDropdownContentItem,
  RightAligned,
  MobileMenuTrigger,
} from './styled'

import { Media, themeMapper } from '../../consts'
import { ProductLogo, ProductVariant } from '../ProductLogo'

const DAO_NAV_ITEMS: MenuItem[] = [
  { href: 'https://cow.fi/', productVariant: ProductVariant.CowDao, hasDivider: true },
  { href: 'https://cow.fi/cow-swap', productVariant: ProductVariant.CowSwap },
  { href: 'https://cow.fi/cow-protocol', productVariant: ProductVariant.CowProtocol },
  { href: 'https://cow.fi/cow-amm', productVariant: ProductVariant.CowAmm },
  { href: 'https://cow.fi/mev-blocker', productVariant: ProductVariant.MevBlocker },
]

interface NavItemProps {
  item: MenuItem
}

export interface MenuItem {
  href?: string
  label?: string
  children?: DropdownMenuItem[]
  productVariant?: ProductVariant
  icon?: string
  isButton?: boolean
  external?: boolean
  bgColor?: string
  hoverBgColor?: string
  color?: string
  hoverColor?: string
  onClick?: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void
  hasDivider?: boolean
}

interface MenuBarProps {
  navItems: MenuItem[]
  theme: 'light' | 'dark'
  productVariant: ProductVariant
  additionalContent?: React.ReactNode
  showGlobalSettings?: boolean
  settingsNavItems?: MenuItem[]
  additionalNavButtons?: MenuItem[]
}

interface DropdownMenuItem {
  href?: string
  external?: boolean
  label?: string
  icon?: string
  description?: string
  isButton?: boolean
  children?: DropdownMenuItem[]
  productVariant?: ProductVariant
  hoverBgColor?: string
  bgColor?: string
  color?: string
  hoverColor?: string
  onClick?: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void
  hasDivider?: boolean
}

interface DropdownMenuContent {
  title: string | undefined
  items?: DropdownMenuItem[]
}

interface DropdownProps {
  isOpen: boolean
  content: DropdownMenuContent
  onTrigger: () => void
  interaction: 'hover' | 'click'
}

const NavItem = ({
  item,
  isClickable = false,
  mobileMode = false,
}: NavItemProps & { isClickable?: boolean; mobileMode?: boolean }) => {
  const [isOpen, setIsOpen] = useState(false)
  const handleToggle = () => setIsOpen((prevIsOpen) => !prevIsOpen)

  return item.children ? (
    <GenericDropdown
      isOpen={isOpen}
      content={{ title: item.label, items: item.children }}
      onTrigger={handleToggle}
      interaction={isClickable || mobileMode ? 'click' : 'hover'}
      mobileMode={mobileMode}
      isNavItemDropdown={true}
    />
  ) : (
    <RootNavItem
      href={item.href}
      mobileMode={mobileMode}
      target={item.external ? '_blank' : undefined}
      rel={item.external ? 'noopener noreferrer nofollow' : undefined}
    >
      {item.label} {item.external && <span>&#8599;</span>}
    </RootNavItem>
  )
}

const DropdownContentItem: React.FC<{ item: DropdownMenuItem; theme: CowSwapTheme; closeMenu: () => void }> = ({
  item,
  theme,
  closeMenu,
}) => {
  const [isChildrenVisible, setIsChildrenVisible] = useState(false)

  const handleToggleChildrenVisibility = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setIsChildrenVisible(!isChildrenVisible)
  }

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (item.onClick) {
      e.preventDefault()
      item.onClick(e)
      closeMenu()
    } else if (!item.children) {
      closeMenu()
    } else {
      e.preventDefault()
    }
  }

  const renderItemContent = () => {
    const { productVariant, icon, label, description } = item
    return (
      <>
        {productVariant ? (
          <ProductLogo variant={productVariant} theme={theme} logoIconOnly={false} />
        ) : icon ? (
          <DropdownContentItemImage>
            <img src={icon} alt={label} />
          </DropdownContentItemImage>
        ) : null}
        <DropdownContentItemText>
          <DropdownContentItemTitle>{label}</DropdownContentItemTitle>
          {description && <DropdownContentItemDescription>{description}</DropdownContentItemDescription>}
        </DropdownContentItemText>
      </>
    )
  }

  const itemClassName = item.hasDivider ? 'hasDivider' : ''

  if (item.isButton) {
    return (
      <DropdownContentItemButton
        href={item.href}
        target={item.external ? '_blank' : '_self'}
        rel={item.external ? 'noopener noreferrer' : undefined}
        bgColor={item.bgColor}
        color={item.color}
        hoverBgColor={item.hoverBgColor}
        hoverColor={item.hoverColor}
        onClick={item.onClick ? handleLinkClick : undefined}
        className={itemClassName}
      >
        {renderItemContent()}
        {item.href && !item.children && (
          <SVG src={IMG_ICON_ARROW_RIGHT} className={`arrow-icon-right ${item.external ? 'external' : ''}`} />
        )}
      </DropdownContentItemButton>
    )
  }

  if (item.children) {
    return (
      <>
        <StyledDropdownContentItem
          as="div"
          onClick={handleToggleChildrenVisibility}
          isOpen={isChildrenVisible}
          className={itemClassName}
        >
          {renderItemContent()}
          <SVG src={IMG_ICON_CARRET_DOWN} />
        </StyledDropdownContentItem>
        {isChildrenVisible && (
          <DropdownContentWrapper isThirdLevel content={{ title: undefined, items: item.children }} mobileMode={true} />
        )}
      </>
    )
  }

  return (
    <StyledDropdownContentItem
      as="a"
      href={item.href}
      onClick={handleLinkClick}
      isOpen={isChildrenVisible}
      target={item.external ? '_blank' : undefined}
      rel={item.external ? 'noopener noreferrer' : undefined}
      bgColor={item.bgColor}
      color={item.color}
      hoverBgColor={item.hoverBgColor}
      hoverColor={item.hoverColor}
      className={itemClassName}
    >
      {renderItemContent()}
      {item.external && <span>&#8599;</span>}
      {!item.children && (
        <SVG src={IMG_ICON_ARROW_RIGHT} className={`arrow-icon-right ${item.external ? 'external' : ''}`} />
      )}
    </StyledDropdownContentItem>
  )
}

const NavDaoTrigger: React.FC<{
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  theme: CowSwapTheme
  mobileMode: boolean
}> = ({ isOpen, setIsOpen, theme, mobileMode }) => {
  const triggerRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useOnClickOutside([triggerRef as RefObject<HTMLElement>, dropdownRef as RefObject<HTMLElement>], () =>
    setIsOpen(false)
  )

  const closeMenu = () => setIsOpen(false)

  return (
    <>
      <NavDaoTriggerElement ref={triggerRef} isActive={isOpen} onClick={() => setIsOpen(!isOpen)}>
        <SVG src={IMG_ICON_MENU_DOTS} />
      </NavDaoTriggerElement>
      {isOpen && (
        <DropdownContent isOpen={true} ref={dropdownRef} mobileMode={mobileMode}>
          {DAO_NAV_ITEMS.map((item, index) => (
            <DropdownContentItem key={index} item={item} theme={theme} closeMenu={closeMenu} />
          ))}
        </DropdownContent>
      )}
    </>
  )
}

const GenericDropdown: React.FC<DropdownProps & { mobileMode?: boolean; isNavItemDropdown?: boolean }> = ({
  isOpen,
  content,
  onTrigger,
  interaction,
  mobileMode,
  isNavItemDropdown,
}) => {
  if (!content.title) {
    throw new Error('Dropdown content must have a title')
  }

  const interactionProps =
    interaction === 'hover' ? { onMouseEnter: onTrigger, onMouseLeave: onTrigger } : { onClick: onTrigger }

  return (
    <DropdownMenu {...interactionProps} mobileMode={mobileMode}>
      <RootNavItem as="button" aria-haspopup="true" aria-expanded={isOpen} isOpen={isOpen} mobileMode={mobileMode}>
        <span>{content.title}</span>
        {content.items && <SVG src={IMG_ICON_CARRET_DOWN} />}
      </RootNavItem>
      {isOpen && (
        <DropdownContentWrapper content={content} mobileMode={mobileMode} isNavItemDropdown={isNavItemDropdown} />
      )}
    </DropdownMenu>
  )
}

const DropdownContentWrapper: React.FC<{
  content: DropdownMenuContent
  isThirdLevel?: boolean
  isVisible?: boolean
  mobileMode?: boolean
  isNavItemDropdown?: boolean
}> = ({ content, isThirdLevel = false, isVisible = true, mobileMode = false, isNavItemDropdown = false }) => {
  const [visibleThirdLevel, setVisibleThirdLevel] = useState<{ [key: number]: boolean }>({})

  const handleToggleThirdLevelVisibility = (event: React.MouseEvent<HTMLDivElement>, index: number) => {
    event.preventDefault()
    event.stopPropagation()
    setVisibleThirdLevel((prevState) => ({ ...prevState, [index]: !prevState[index] }))
  }

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.stopPropagation()
  }

  return (
    <DropdownContent
      isOpen={isVisible}
      isThirdLevel={isThirdLevel}
      mobileMode={mobileMode}
      isNavItemDropdown={isNavItemDropdown}
    >
      {content.items?.map((item, index) => {
        const hasChildren = !!item.children
        const Tag = hasChildren ? 'div' : item.isButton ? DropdownContentItemButton : 'a'
        return (
          <StyledDropdownContentItem
            key={index}
            as={Tag}
            href={!hasChildren ? item.href : undefined}
            isOpen={visibleThirdLevel[index]}
            isThirdLevel={isThirdLevel}
            target={!hasChildren && item.external ? '_blank' : undefined}
            rel={!hasChildren && item.external ? 'noopener noreferrer nofollow' : undefined}
            bgColor={item.bgColor}
            color={item.color}
            hoverBgColor={item.hoverBgColor}
            hoverColor={item.hoverColor}
            mobileMode={mobileMode} // Pass mobileMode here
            onClick={(e: React.MouseEvent<HTMLDivElement | HTMLAnchorElement | HTMLButtonElement>) => {
              if (hasChildren) {
                handleToggleThirdLevelVisibility(e as React.MouseEvent<HTMLDivElement>, index)
              } else if (item.isButton) {
                handleLinkClick(e as React.MouseEvent<HTMLAnchorElement>)
              } else {
                handleLinkClick(e as React.MouseEvent<HTMLAnchorElement>)
              }
            }}
          >
            {item.icon && <DropdownContentItemIcon src={item.icon} alt="" />}
            <DropdownContentItemText>
              <DropdownContentItemTitle>{item.label}</DropdownContentItemTitle>
              {item.description && <DropdownContentItemDescription>{item.description}</DropdownContentItemDescription>}
            </DropdownContentItemText>
            {item.children && <SVG src={IMG_ICON_CARRET_DOWN} />}
            {!item.children && (
              <SVG src={IMG_ICON_ARROW_RIGHT} className={`arrow-icon-right ${item.external ? 'external' : ''}`} />
            )}
            {item.children && visibleThirdLevel[index] && (
              <DropdownContentWrapper
                content={{ title: undefined, items: item.children }}
                isThirdLevel
                isVisible={visibleThirdLevel[index]}
                mobileMode={mobileMode} // Pass mobileMode here
                isNavItemDropdown={isNavItemDropdown}
              />
            )}
          </StyledDropdownContentItem>
        )
      })}
    </DropdownContent>
  )
}

const GlobalSettingsDropdown: React.FC<{ mobileMode: boolean; settingsNavItems?: MenuItem[] }> = ({
  mobileMode,
  settingsNavItems,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useOnClickOutside([buttonRef as RefObject<HTMLElement>, dropdownRef as RefObject<HTMLElement>], () =>
    setIsOpen(false)
  )

  if (!settingsNavItems || settingsNavItems.length === 0) {
    return null
  }

  return (
    <GlobalSettingsWrapper>
      <GlobalSettingsButton ref={buttonRef} onClick={() => setIsOpen(!isOpen)}>
        <SVG src={IMG_ICON_SETTINGS_GLOBAL} />
      </GlobalSettingsButton>
      {isOpen && (
        <DropdownContent isOpen={true} ref={dropdownRef} alignRight mobileMode={mobileMode}>
          {settingsNavItems.map((item, index) => (
            <StyledDropdownContentItem
              key={index}
              href={item.href}
              onClick={item.onClick} // Handle onClick here
            >
              <DropdownContentItemText>
                <DropdownContentItemTitle>{item.label}</DropdownContentItemTitle>
              </DropdownContentItemText>
              <SVG src={IMG_ICON_ARROW_RIGHT} className="arrow-icon-right" />
            </StyledDropdownContentItem>
          ))}
        </DropdownContent>
      )}
    </GlobalSettingsWrapper>
  )
}

export const MenuBar = (props: MenuBarProps) => {
  const {
    navItems,
    theme,
    productVariant,
    additionalContent,
    showGlobalSettings,
    additionalNavButtons,
    settingsNavItems,
  } = props
  const [isDaoOpen, setIsDaoOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const menuRef = useRef(null)
  const mobileMenuRef = useRef(null)
  const mobileMenuTriggerRef = useRef<HTMLDivElement>(null)

  const styledTheme = {
    ...themeMapper(theme),
    mode: theme,
  }

  useOnClickOutside([menuRef as RefObject<HTMLElement>], () => setIsDaoOpen(false))
  useOnClickOutside([mobileMenuRef as RefObject<HTMLElement>, mobileMenuTriggerRef as RefObject<HTMLElement>], () =>
    setIsMobileMenuOpen(false)
  )

  const isMobile = useMediaQuery(Media.upToLarge(false))

  const handleMobileMenuToggle = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  React.useEffect(() => {
    if (isMobile) {
      if (isMobileMenuOpen || isDaoOpen) {
        addBodyClass('noScroll')
      } else {
        removeBodyClass('noScroll')
      }
    }

    return () => {
      removeBodyClass('noScroll')
    }
  }, [isMobile, isMobileMenuOpen, isDaoOpen])

  return (
    <ThemeProvider theme={styledTheme}>
      <MenuBarWrapper ref={menuRef}>
        <MenuBarInner theme={styledTheme}>
          <NavDaoTrigger isOpen={isDaoOpen} setIsOpen={setIsDaoOpen} theme={theme} mobileMode={isMobile} />
          <ProductLogo variant={productVariant} theme={theme} logoIconOnly={isMobile} href="/" />

          {!isMobile && (
            <NavItems theme={styledTheme}>
              {navItems.map((item, index) => (
                <NavItem key={index} item={item} mobileMode={isMobile} />
              ))}
            </NavItems>
          )}

          {(additionalContent || additionalNavButtons || (showGlobalSettings && settingsNavItems)) && (
            <RightAligned mobileMode={isMobile} flexFlowMobile="row wrap">
              {!isMobile && additionalContent}

              {!isMobile &&
                additionalNavButtons &&
                additionalNavButtons.map((item, index) => (
                  <DropdownContentItemButton
                    key={index}
                    href={item.href}
                    target={item.external ? '_blank' : '_self'}
                    rel={item.external ? 'noopener noreferrer' : undefined}
                    bgColor={item.bgColor}
                    color={item.color}
                    hoverBgColor={item.hoverBgColor}
                    hoverColor={item.hoverColor}
                    mobileMode={isMobile}
                  >
                    <DropdownContentItemText>
                      <DropdownContentItemTitle>{item.label}</DropdownContentItemTitle>
                    </DropdownContentItemText>
                    <SVG src={IMG_ICON_ARROW_RIGHT} className={`arrow-icon-right ${item.external ? 'external' : ''}`} />
                  </DropdownContentItemButton>
                ))}

              {showGlobalSettings && settingsNavItems && (
                <GlobalSettingsDropdown mobileMode={isMobile} settingsNavItems={settingsNavItems} />
              )}

              {isMobile && (
                <MobileMenuTrigger ref={mobileMenuTriggerRef} theme={styledTheme} onClick={handleMobileMenuToggle}>
                  <SVG src={isMobileMenuOpen ? IMG_ICON_X : IMG_ICON_MENU_HAMBURGER} />
                </MobileMenuTrigger>
              )}
            </RightAligned>
          )}
        </MenuBarInner>

        {isMobile && isMobileMenuOpen && (
          <NavItems mobileMode={isMobile} ref={mobileMenuRef} theme={styledTheme}>
            <div>
              {navItems.map((item, index) => (
                <NavItem key={index} item={item} mobileMode={isMobile} />
              ))}
              <RightAligned mobileMode={isMobile}>
                {additionalContent}
                {additionalNavButtons &&
                  additionalNavButtons.map((item, index) => (
                    <DropdownContentItemButton
                      key={index}
                      href={item.href}
                      target={item.external ? '_blank' : '_self'}
                      rel={item.external ? 'noopener noreferrer' : undefined}
                      bgColor={item.bgColor}
                      color={item.color}
                      hoverBgColor={item.hoverBgColor}
                      hoverColor={item.hoverColor}
                    >
                      <DropdownContentItemText>
                        <DropdownContentItemTitle>{item.label}</DropdownContentItemTitle>
                      </DropdownContentItemText>
                      <SVG
                        src={IMG_ICON_ARROW_RIGHT}
                        className={`arrow-icon-right ${item.external ? 'external' : ''}`}
                      />
                    </DropdownContentItemButton>
                  ))}
              </RightAligned>
            </div>
          </NavItems>
        )}
      </MenuBarWrapper>
    </ThemeProvider>
  )
}
