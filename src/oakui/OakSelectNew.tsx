import React, { useEffect, useRef, useState } from 'react';
import { newId, receiveMessage, sendMessage } from '../events/MessageService';
import OakTextPlain from './OakTextPlain';
import './styles/OakSelectNew.scss';

interface Props {
  id: string;
  label?: string;
  handleChange: any;
  error?: boolean;
  data: any;
  elements?: string[];
  objects?: Array<any>;
  disabled?: boolean;
  theme?: 'primary' | 'secondary' | 'tertiary' | 'default';
}

const OakSelectNew = (props: Props) => {
  const [id, setId] = useState(newId());
  const [currentIndex, _setCurrentIndex] = useState(-1);
  const currentIndexRef = useRef(currentIndex);
  const setCurrentIndex = value => {
    currentIndexRef.current = value;
    _setCurrentIndex(value);
  };

  const [searchResults, _setSearchResults] = useState<any[]>([]);
  const searchResultsRef = useRef(searchResults);
  const setSearchResults = value => {
    searchResultsRef.current = value;
    _setSearchResults(value);
  };

  const [searchOn, _setSearchOn] = useState(false);
  const searchOnRef = useRef(searchOn);
  const setSearchOn = value => {
    searchOnRef.current = value;
    _setSearchOn(value);
  };

  const isScrolledIntoView = (el, invertDirection = false) => {
    var rect = el.getBoundingClientRect();
    var elemTop = rect.top;
    var elemBottom = rect.bottom;

    const containerEl = document.getElementById(`${id}-results-ul`);
    if (!containerEl) {
      return true;
    }

    // Only completely visible elements return true:
    let isVisible = true;
    if (invertDirection) {
      isVisible =
        elemTop >= 0 &&
        elemBottom <=
          containerEl.getBoundingClientRect().height +
            containerEl.getBoundingClientRect().top;
    } else {
      isVisible =
        elemTop >= 0 &&
        elemTop >=
          containerEl.getBoundingClientRect().height +
            containerEl.getBoundingClientRect().top;
    }

    // Partially visible elements return true:
    //isVisible = elemTop < containerEl.getBoundingClientRect().height && elemBottom >= 0;
    return isVisible;
  };

  const navigateDown = () => {
    if (currentIndexRef.current < searchResultsRef.current.length - 1) {
      const elRef = document.getElementById(
        `${id}-${currentIndexRef.current + 1}`
      );
      if (elRef && !isScrolledIntoView(elRef, true)) {
        elRef.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
      }
      setCurrentIndex(currentIndexRef.current + 1);
    }
  };

  const navigateUp = () => {
    if (currentIndexRef.current > 0) {
      const elRef = document.getElementById(
        `${id}-${currentIndexRef.current - 1}`
      );
      if (elRef && !isScrolledIntoView(elRef)) {
        elRef.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
      }
      setCurrentIndex(currentIndexRef.current - 1);
    }
  };

  const navigateHome = () => {
    const elRef = document.getElementById(`${id}-0`);
    if (elRef) {
      elRef.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    }
    setCurrentIndex(0);
  };

  const navigateEnd = () => {
    const elRef = document.getElementById(
      `${id}-${searchResultsRef.current.length - 1}`
    );
    if (elRef) {
      elRef.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    }
    setCurrentIndex(searchResultsRef.current.length - 1);
  };

  const [criteria, setCriteria] = useState({
    [props.id]: '',
  });

  useEffect(() => {
    updateSearchResults(criteria[props.id]);
  }, [props.objects, props.elements, criteria]);

  const handleChange = event => {
    setCriteria({ [event.target.name]: event.target.value });
  };

  const updateSearchResults = searchCriteria => {
    let searchResults: any[] = [];

    if (props.elements && searchCriteria) {
      searchResults = props.elements?.filter(item =>
        item.toLowerCase().includes(searchCriteria.toString().toLowerCase())
      );
    } else if (props.elements) {
      searchResults = [...props.elements];
    }
    const existingDataIndex = searchResults.indexOf(props.data[props.id]);
    setCurrentIndex(existingDataIndex > 0 ? existingDataIndex : 0);
    setSearchResults(searchResults);
  };

  const getStyle = () => {
    let style = props.theme ? props.theme : '';

    return style;
  };

  useEffect(() => {
    if (!searchOn) {
      setCurrentIndex(0);
      setCriteria({ [props.id]: props.data[props.id] });
      document.body.style.overflow = 'auto';
    }
  }, [searchOn]);

  const handleFocus = () => {
    setSearchOn(true);
  };

  useEffect(() => {
    window.addEventListener('click', (e: any) => {
      if (!document.getElementById(id)?.contains(e.target)) {
        setSearchOn(false);
      }
    });
    window.addEventListener('keydown', (e: any) => {
      if (
        !document.getElementById(id)?.contains(e.target) ||
        ['Tab', 'Escape'].includes(e.key)
      ) {
        setSearchOn(false);
      }
    });

    const docRef = document.getElementById(id);
    if (docRef) {
      docRef.addEventListener('keydown', event => {
        switch (event.key) {
          case 'ArrowDown':
            setSearchOn(true);
            navigateDown();
            break;
          case 'ArrowUp':
            setSearchOn(true);
            navigateUp();
            break;
          case 'Home':
            setSearchOn(true);
            navigateHome();
            break;
          case 'End':
            setSearchOn(true);
            navigateEnd();
            break;
          case 'Enter':
            selected(searchResultsRef.current[currentIndexRef.current]);
            break;
          default:
            break;
        }
      });
    }
  }, []);

  const selected = item => {
    if (searchOnRef.current && item) {
      searchOnRef.current = false;
      setSearchOn(false);
      props.handleChange({
        currentTarget: {
          name: props.id,
          value: item,
        },
      });
    }
  };

  useEffect(() => {
    setCriteria({ [props.id]: props.data[props.id] });
  }, [props.data[props.id]]);

  return (
    <div className={`oak-select-new ${getStyle()}`} id={id}>
      <div className="oak-select-new--input" id={`${id}-input`}>
        <OakTextPlain
          data={criteria}
          id={props.id}
          handleChange={handleChange}
          handleFocus={handleFocus}
          label={props.label}
        />
      </div>
      {searchOn && searchResults && (
        <div className="oak-select-new--results">
          <ul
            role="listbox"
            id={`${id}-results-ul`}
          >
            {searchResults.map((item, index) => (
              <li
                id={`${id}-${index}`}
                onMouseOver={() => setCurrentIndex(index)}
                onClick={() => selected(item)}
                role="option"
                className={currentIndex === index ? 'option-active' : ''}
              >
                {item}
              </li>
            ))}
            {searchResults.length === 0 && <li>No results found</li>}
          </ul>
        </div>
      )}
    </div>
  );
};

export default OakSelectNew;
