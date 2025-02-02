/* eslint-disable @typescript-eslint/indent */
/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useState, useEffect } from 'react';
import { useFetcher, useNavigate } from '@remix-run/react';
import {
  Container,
  Spacer,
  Divider,
  Button,
  Tooltip,
  Row,
  Col,
  Card,
  Avatar,
} from '@nextui-org/react';
import Image, { MimeType } from 'remix-image';
import tinycolor from 'tinycolor2';

import { IEpisode, IMovieTranslations } from '~/services/tmdb/tmdb.types';
import { ITrailer, IEpisodeInfo } from '~/services/consumet/anilist/anilist.types';
import { IMedia } from '~/types/media';

import useMediaQuery from '~/hooks/useMediaQuery';

import MediaList from '~/src/components/media/MediaList';
import ListEpisodes from '~/src/components/elements/shared/ListEpisodes';
import Flex from '~/src/components/styles/Flex.styles';
import { H2, H5, H6 } from '~/src/components/styles/Text.styles';
import WatchTrailerModal, { Trailer } from '~/src/components/elements/modal/WatchTrailerModal';

import AnilistStatIcon from '~/src/assets/icons/AnilistStatIcon.js';
import PhotoIcon from '~/src/assets/icons/PhotoIcon.js';

interface IWatchDetailProps {
  id?: number | string | undefined;
  type: 'movie' | 'tv' | 'anime';
  title: string;
  orgTitle?: string;
  overview?: string;
  posterPath?: string;
  tmdbRating?: number;
  imdbRating?: number;
  anilistRating?: number;
  genresMedia?: {
    id?: number;
    name?: string;
  }[];
  genresAnime?: string[];
  recommendationsMovies?: IMedia[];
  recommendationsAnime?: IMedia[];
  genresMovie?: { [id: string]: string };
  genresTv?: { [id: string]: string };
  color?: string;
  trailerAnime?: ITrailer;
  episodes?: IEpisode[] | IEpisodeInfo[];
  year?: number;
  translations?: IMovieTranslations;
  season?: number;
}

const WatchDetail: React.FC<IWatchDetailProps> = (props: IWatchDetailProps) => {
  const {
    id,
    type,
    title,
    orgTitle,
    overview,
    posterPath,
    tmdbRating,
    imdbRating,
    anilistRating,
    genresMedia,
    genresAnime,
    recommendationsMovies,
    recommendationsAnime,
    genresMovie,
    genresTv,
    color,
    trailerAnime,
    episodes,
    year,
    translations,
    season,
  } = props;
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [trailer, setTrailer] = useState<Trailer>({});
  const closeHandler = () => {
    setVisible(false);
    if (type === 'movie' || type === 'tv') setTrailer({});
  };
  const isSm = useMediaQuery('(max-width: 650px)');
  const colorBackground = tinycolor(color).isDark()
    ? tinycolor(color).brighten(40).saturate(70).spin(180).toString()
    : tinycolor(color).darken(40).saturate(70).spin(180).toString();

  useEffect(() => {
    if (fetcher.data && fetcher.data.videos) {
      const { results } = fetcher.data.videos;
      const officialTrailer = results.find((result: Trailer) => result.type === 'Trailer');
      setTrailer(officialTrailer);
    }
  }, [fetcher.data]);
  return (
    <>
      <Container
        fluid
        alignItems="stretch"
        justify="center"
        css={{
          marginTop: '0.75rem',
          padding: '0 0.75rem',
          '@xs': {
            padding: '0 3vw',
          },
          '@sm': {
            padding: '0 6vw',
          },
          '@md': {
            padding: '0 12vw',
          },
        }}
      >
        <Flex justify="start" align="center" wrap="wrap">
          <Tooltip content="In development">
            <Button size="sm" color="primary" auto ghost css={{ marginBottom: '0.75rem' }}>
              Toggle Light
            </Button>
          </Tooltip>
          <Spacer x={0.5} />
          <Button
            size="sm"
            color="primary"
            auto
            ghost
            onClick={() => {
              setVisible(true);
              if (type === 'movie' || type === 'tv')
                fetcher.load(`/${type === 'movie' ? 'movies' : 'tv-shows'}/${id}/videos`);
            }}
            css={{ marginBottom: '0.75rem' }}
          >
            Watch Trailer
          </Button>
          <Spacer x={0.5} />
          <Tooltip content="In development">
            <Button size="sm" color="primary" auto ghost css={{ marginBottom: '0.75rem' }}>
              Add to Watchlist
            </Button>
          </Tooltip>
        </Flex>
        <Spacer y={1} />
        <Divider x={1} css={{ m: 0 }} />
        <Spacer y={1} />
        {type === 'anime' || type === 'tv' ? (
          <>
            <Row>
              {type === 'anime' ? (
                <Col span={12}>
                  <ListEpisodes
                    type="anime"
                    id={id}
                    episodes={episodes}
                    title={title}
                    orgTitle={orgTitle || ''}
                    year={Number(year)}
                  />
                </Col>
              ) : null}
              {type === 'tv' ? (
                <Col span={12}>
                  <ListEpisodes
                    type="tv"
                    id={id}
                    episodes={episodes}
                    title={title}
                    orgTitle={orgTitle || ''}
                    year={Number(year)}
                    translations={translations}
                    season={season}
                  />
                </Col>
              ) : null}
            </Row>
            <Spacer y={1} />
            <Divider x={1} css={{ m: 0 }} />
            <Spacer y={1} />
          </>
        ) : null}
        <Row>
          {!isSm && (
            <Col span={4}>
              {posterPath ? (
                <Card.Image
                  // @ts-ignore
                  as={Image}
                  src={posterPath}
                  alt={title}
                  title={title}
                  objectFit="cover"
                  width="50%"
                  showSkeleton
                  css={{
                    minWidth: 'auto !important',
                    minHeight: '205px !important',
                    borderRadius: '24px',
                  }}
                  loaderUrl="/api/image"
                  placeholder="empty"
                  responsive={[
                    {
                      size: {
                        width: 137,
                        height: 205,
                      },
                      maxWidth: 960,
                    },
                    {
                      size: {
                        width: 158,
                        height: 237,
                      },
                      maxWidth: 1280,
                    },
                    {
                      size: {
                        width: 173,
                        height: 260,
                      },
                      maxWidth: 1400,
                    },
                    {
                      size: {
                        width: 239,
                        height: 359,
                      },
                    },
                  ]}
                  options={{
                    contentType: MimeType.WEBP,
                  }}
                />
              ) : (
                <Row align="center" justify="center">
                  <Avatar
                    icon={<PhotoIcon width={48} height={48} />}
                    css={{
                      width: '50% !important',
                      size: '$20',
                      minWidth: 'auto !important',
                      minHeight: '205px !important',
                      marginTop: '10vh',
                      borderRadius: '24px !important',
                    }}
                  />
                </Row>
              )}
            </Col>
          )}
          <Col span={isSm ? 12 : 8}>
            <Row>
              <H2 h2 weight="bold">
                {title}
              </H2>
            </Row>
            <Spacer y={0.5} />
            {type === 'movie' || type === 'tv' ? (
              <>
                <Flex direction="row">
                  <H5
                    h5
                    css={{
                      backgroundColor: '#3ec2c2',
                      borderRadius: '$xs',
                      padding: '0 0.25rem 0 0.25rem',
                      marginRight: '0.5rem',
                    }}
                  >
                    TMDb
                  </H5>
                  <H5 h5>{tmdbRating && tmdbRating.toFixed(1)}</H5>
                  {imdbRating && (
                    <>
                      <Spacer x={1.25} />
                      <H5
                        h5
                        css={{
                          backgroundColor: '#ddb600',
                          color: '#000',
                          borderRadius: '$xs',
                          padding: '0 0.25rem 0 0.25rem',
                          marginRight: '0.5rem',
                        }}
                      >
                        IMDb
                      </H5>
                      <H5 h5>{imdbRating}</H5>
                    </>
                  )}
                </Flex>
                <Spacer y={1} />
              </>
            ) : null}
            {type === 'anime' && anilistRating ? (
              <>
                <Flex direction="row" align="center">
                  {anilistRating > 75 ? (
                    <AnilistStatIcon stat="good" />
                  ) : anilistRating > 60 ? (
                    <AnilistStatIcon stat="average" />
                  ) : (
                    <AnilistStatIcon stat="bad" />
                  )}
                  <Spacer x={0.25} />
                  <H5 weight="bold">{anilistRating}%</H5>
                </Flex>
                <Spacer y={1} />
              </>
            ) : null}
            <Row fluid align="center" wrap="wrap" justify="flex-start" css={{ width: '100%' }}>
              {(type === 'movie' || type === 'tv') &&
                genresMedia &&
                genresMedia.map((genre) => (
                  <>
                    <Button
                      color="primary"
                      auto
                      ghost
                      rounded
                      key={genre?.id}
                      size={isSm ? 'sm' : 'md'}
                      css={{ marginBottom: '0.125rem' }}
                      onClick={() =>
                        navigate(
                          `/${type === 'movie' ? 'movies' : 'tv-shows'}/discover?with_genres=${
                            genre?.id
                          }`,
                        )
                      }
                    >
                      {genre?.name}
                    </Button>
                    <Spacer x={1} />
                  </>
                ))}
              {type === 'anime' &&
                genresAnime &&
                genresAnime.map((genre, index) => (
                  <>
                    <Button
                      auto
                      rounded
                      key={index}
                      size={isSm ? 'sm' : 'md'}
                      css={{
                        marginBottom: '0.125rem',
                        background: color,
                        color: colorBackground,
                        '&:hover': {
                          background: colorBackground,
                          color,
                        },
                      }}
                    >
                      {genre}
                    </Button>
                    <Spacer x={1} />
                  </>
                ))}
            </Row>
            <Spacer y={1} />
            <Row>
              {type === 'movie' || type === 'tv' ? (
                <H6 h6 css={{ textAlign: 'justify' }}>
                  {overview}
                </H6>
              ) : null}
              {type === 'anime' ? (
                <H6
                  h6
                  css={{ textAlign: 'justify' }}
                  dangerouslySetInnerHTML={{ __html: overview || '' }}
                />
              ) : null}
            </Row>
            <Spacer y={1} />
          </Col>
        </Row>
        <Spacer y={1} />
        <Divider x={1} css={{ m: 0 }} />
        <Spacer y={1} />
        {(type === 'movie' || type === 'tv') &&
        recommendationsMovies &&
        recommendationsMovies.length > 0 ? (
          <>
            <MediaList
              genresMovie={genresMovie}
              genresTv={genresTv}
              items={recommendationsMovies}
              itemsType={type}
              listName="You May Also Like"
              listType="slider-card"
              navigationButtons
              onClickViewMore={() =>
                navigate(`/${type === 'movie' ? 'movies' : 'tv-shows'}/${id}/recommendations`)
              }
              showMoreList
            />
            <Spacer y={1} />
            <Divider x={1} css={{ m: 0 }} />
            <Spacer y={1} />
          </>
        ) : null}
        {type === 'anime' && recommendationsAnime && recommendationsAnime.length > 0 ? (
          <>
            <MediaList
              items={recommendationsAnime}
              itemsType="anime"
              listName="You May Also Like"
              listType="slider-card"
              navigationButtons
            />
            <Spacer y={1} />
            <Divider x={1} css={{ m: 0 }} />
            <Spacer y={1} />
          </>
        ) : null}
      </Container>
      {(type === 'movie' || type === 'tv') && (
        <WatchTrailerModal trailer={trailer} visible={visible} closeHandler={closeHandler} />
      )}
      {type === 'anime' && trailerAnime && (
        <WatchTrailerModal trailer={trailerAnime} visible={visible} closeHandler={closeHandler} />
      )}
    </>
  );
};

export default WatchDetail;
